import * as acorn from "acorn";
import { ContextLifecycleWorkflow } from "../runtime-time/context-lifecycle-workflow.js";
import { VariableResolutionWorkflow } from "../runtime-time/variable-resolution-workflow.js";
import { ControlFlowWorkflow } from "../runtime-time/control-flow-workflow.js";
import { TerminalRenderer as T } from "../ui/terminal-renderer.js";
import { LexicalEnvironment } from "../runtime-space/lexical-environment.js";
import { VariableEnvironment } from "../runtime-space/variable-environment.js";

export class RuntimeEngine {
  lastValue = undefined;

  constructor() {
    this.contexts = new ContextLifecycleWorkflow();
    this.variables = new VariableResolutionWorkflow();
    this.controlFlow = new ControlFlowWorkflow(this);
  }

  // ───────────────────────────────
  // Lifecycle
  // ───────────────────────────────
  init() {
    this.contexts.initializeGlobalContext();
  }

  terminate() {
    this.contexts.terminate();
  }

  // ───────────────────────────────
  // Environment Access
  // ───────────────────────────────
  getCurrentEnvs() {
    const ctx = this.contexts.currentContext();
    return {
      lexical: ctx.lexicalEnv,
      variable: ctx.variableEnv,
    };
  }

  define(name, value, kind, envs) {
    this.variables.define(name, value, kind, envs);
    const safe =
      value && value.type === "FunctionObject"
        ? `[FunctionObject ${value.name}]`
        : JSON.stringify(value);

    this.renderSnapshot(`define ${name} = ${safe} (${kind})`);
  }

  resolve(name) {
    const envs = this.getCurrentEnvs();
    return this.variables.resolve(name, envs);
  }
  
pushBlockEnv() {
  const ctx = this.contexts.currentContext();
  ctx.lexicalEnv = new LexicalEnvironment(ctx.lexicalEnv);
}


  popBlockEnv() {
    const ctx = this.contexts.currentContext();
    ctx.lexicalEnv = ctx.lexicalEnv.outer;
  }

  callFunction(fn, args) {
    if (!fn || fn.type !== "FunctionObject") {
      throw new TypeError("CallExpression: callee is not a function");
    }

    if (fn.params.length !== args.length) {
      throw new TypeError(
        `CallExpression: expected ${fn.params.length} arguments but got ${args.length}`
      );
    }

    // 1. Push new frame

    const ctx = this.contexts.callStack.pushContext(
  fn.name,
  fn.closure,                     // lexical closure parent
  this.variables.globalVariable   // var environment parent (JS spec)
);

    this.renderSnapshot(`call ${fn.name}(${args.join(", ")})`);

    // 2. Fresh lexical + variable env based on closure
    const closure = fn.closure;
    ctx.lexicalEnv = new LexicalEnvironment(closure);
    ctx.variableEnv = new VariableEnvironment(closure);

    // 3. Bind params
    fn.params.forEach((param, i) => {
      ctx.lexicalEnv.define(param, args[i]);
    });

    // 4. Execute function body
    const completion = this.controlFlow.execute(fn.body.body);

    // 5. Pop frame
    this.contexts.callStack.popContext();

    // 6. Log exit
    this.renderSnapshot(
      `return from ${fn.name} => ${completion ? completion.value : undefined}`
    );

    return completion ? completion.value : undefined;
  }

  // ───────────────────────────────
  // Execution
  // ───────────────────────────────
  run(code) {
    const ast = acorn.parse(code, { ecmaVersion: "latest" });
    this.controlFlow.execute(ast.body);
  }

  // ───────────────────────────────
  // Snapshot
  // ───────────────────────────────
  renderSnapshot(action) {
    const ctx = this.contexts.currentContext();
    const envs = this.getCurrentEnvs();
    const frames = this.contexts.callStack.printStack();

    console.log(T.header(`ACTION: ${action}`));

    // Execution context tree
    console.log(
      T.block("CALL STACK (execution contexts)", T.formatCallStack(frames))
    );

    // Lexical / var scope trees
    console.log(
      T.block("LEXICAL SCOPE CHAIN", T.formatLexicalChain(envs.lexical))
    );
    console.log(
      T.block("VARIABLE SCOPE CHAIN", T.formatVariableChain(envs.variable))
    );

    console.log("-".repeat(40));
  }
}
