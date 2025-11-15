// engine/runtime-engine.js
import * as acorn from "acorn";
import { LexicalEnvironment } from "../runtime-space/lexical-environment.js";
import { ContextLifecycleWorkflow } from "../runtime-time/context-lifecycle-workflow.js";
import { ControlFlowWorkflow } from "../runtime-time/control-flow-workflow.js";
import { VariableResolutionWorkflow } from "../runtime-time/variable-resolution-workflow.js";
import { TerminalRenderer as T } from "../ui/terminal-renderer.js";

import { DeclarationInstantiationWorkflow } from "../instantiation/declaration-instantiation-workflow.js";

export class RuntimeEngine {
  lastValue = undefined;

  constructor() {
    this.contexts = new ContextLifecycleWorkflow();
    this.variables = new VariableResolutionWorkflow();
    this.controlFlow = new ControlFlowWorkflow(this);

    this.instantiator = new DeclarationInstantiationWorkflow(this);
  }

  // ───────────────────────────────
  // Lifecycle
  // ───────────────────────────────
  // UC12 FIX — init does NOT create global context anymore
  init() {
    // do nothing — global context is created by instantiation phase
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

  // ───────────────────────────────
  // Block scoping
  // ───────────────────────────────
  pushBlockEnv() {
    const ctx = this.contexts.currentContext();
    ctx.lexicalEnv = new LexicalEnvironment(ctx.lexicalEnv);
  }

  popBlockEnv() {
    const ctx = this.contexts.currentContext();
    ctx.lexicalEnv = ctx.lexicalEnv.outer;
  }

  // ───────────────────────────────
  // CallExpression / Function Execution
  // ───────────────────────────────
  callFunction(fn, args) {
    if (!fn || fn.type !== "FunctionObject") {
      throw new TypeError("CallExpression: callee is not a function");
    }

    if (fn.params.length !== args.length) {
      throw new TypeError(
        `CallExpression: expected ${fn.params.length} args but got ${args.length}`
      );
    }

    // Create new execution context using function closure
    const ctx = this.contexts.callStack.pushContext(
      fn.name,
      fn.closure, // correct lexical parent
      this.variables.globalVariable
    );

    this.renderSnapshot(`call ${fn.name}(${args.join(", ")})`);

    // DO NOT overwrite ctx.lexicalEnv / ctx.variableEnv
    // Instead: reuse what ExecutionContext already created

    // Bind parameters into lexical environment
    fn.params.forEach((param, i) => {
      ctx.lexicalEnv.define(param, args[i]);
    });

    // Execute body
    const completion = this.controlFlow.execute(fn.body.body);

    // Pop context
    this.contexts.callStack.popContext();

    return completion ? completion.value : undefined;
  }

  // ───────────────────────────────
  // Execution
  // ───────────────────────────────
  run(code) {
    this.renderPhase("PHASE 1 — PARSE");
    const ast = acorn.parse(code, { ecmaVersion: "latest" });
    this.renderParsedAST(ast);

    this.renderPhase("PHASE 2 — INSTANTIATE");
    const { globalLex, globalVar } = this.instantiator.instantiateGlobal(ast);

    this.renderPhase("PHASE 3 — CONTEXT CREATE");
    this.contexts.initializeGlobalContext(globalLex, globalVar);
    this.renderGlobalContextState(globalLex, globalVar);

    this.renderPhase("PHASE 4 — EXECUTE");
    const completion = this.controlFlow.execute(ast.body);

    this.renderPhase("PHASE 5 — COMPLETE");
    return completion ? completion.value : this.lastValue;
  }

  // ───────────────────────────────
  // Snapshot renderer
  // ───────────────────────────────
  renderSnapshot(action) {
    const ctx = this.contexts.currentContext();
    const envs = this.getCurrentEnvs();
    const frames = this.contexts.callStack.printStack();

    console.log(`ACTION: ${action}`);
    console.log("-".repeat(40));

    console.log(
      T.block("CALL STACK (execution contexts)", T.formatCallStack(frames))
    );

    console.log(
      T.block("LEXICAL SCOPE CHAIN", T.formatLexicalChain(envs.lexical))
    );

    console.log(
      T.block("VARIABLE SCOPE CHAIN", T.formatVariableChain(envs.variable))
    );

    console.log("-".repeat(40));
  }

  renderPhase(phaseName) {
    console.log(`\n──────── ${phaseName} ────────`);
  }

  renderParsedAST(ast) {
    console.log("AST (Program.body):", ast.body);
  }

  renderGlobalContextState(globalLex, globalVar) {
    console.log("CALL STACK:", this.contexts.callStack.printStack());
    console.log("GLOBAL LEXICAL:", globalLex.environmentRecord);
    console.log("GLOBAL VARIABLE:", globalVar.environmentRecord);
    console.log("----------------------------------------");
  }
}
