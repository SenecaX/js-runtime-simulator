import * as acorn from "acorn";
import { ContextLifecycleWorkflow } from "../runtime-time/context-lifecycle-workflow.js";
import { VariableResolutionWorkflow } from "../runtime-time/variable-resolution-workflow.js";
import { ControlFlowWorkflow } from "../runtime-time/control-flow-workflow.js";
import { TerminalRenderer as T } from "../ui/terminal-renderer.js";

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
    ctx.lexicalEnv = new ctx.lexicalEnv.constructor(ctx.lexicalEnv);
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

  // 1. Push context frame
  const ctx = this.contexts.callStack.pushContext(fn.name);

  // 2. Replace lexical + variable env with fresh ones
  const closure = fn.closure;

  ctx.lexicalEnv = new ctx.lexicalEnv.constructor(closure);
  ctx.variableEnv = new ctx.variableEnv.constructor(closure);

  // 3. Bind parameters
  fn.params.forEach((param, i) => {
    ctx.lexicalEnv.define(param, args[i]);
  });

  // 4. Execute body
  const completion = this.controlFlow.execute(fn.body.body);

  // 5. Pop context
  this.contexts.callStack.popContext();

  // 6. Return value
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

    console.log(T.block("CALL STACK", T.formatCallStack(frames)));

    console.log(T.block("LexicalEnv Chain", T.formatEnvChain(envs.lexical)));


    console.log(T.block("VariableEnv Chain", T.formatEnvChain(envs.variable)));

    console.log("-".repeat(40));
  }
}
