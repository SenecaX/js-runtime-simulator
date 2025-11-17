// core/engine/runtime-engine.js
import * as acorn from "acorn";

import { LexicalEnvironment } from "../space/lexical-environment.js";

import { ContextLifecycleWorkflow } from "../time/context-lifecycle.js";
import { ControlFlowWorkflow } from "../time/control-flow.js";
import { VariableResolutionWorkflow } from "../time/variable-resolution.js";

import { InstantiationWorkflow } from "../instantiation/instantiation-workflow.js";

import { EngineRenderer } from "../ui/engine-renderer.js";

export class RuntimeEngine {
  lastValue = undefined;

  constructor() {
    // Core subsystems
    this.lexEnvConstructor = LexicalEnvironment;
    this.contexts = new ContextLifecycleWorkflow();
    this.variables = new VariableResolutionWorkflow();
    this.controlFlow = new ControlFlowWorkflow(this);
    this.instantiator = new InstantiationWorkflow(this);

    // Presentation layer
    this.renderer = new EngineRenderer(this);
  }

  // ───────────────────────────────
  // Lifecycle
  // ───────────────────────────────
  init() {
    // UC12 FIX — global context is created by instantiation
  }

  terminate() {
    this.contexts.terminate();
  }

  // ───────────────────────────────
  // Environment access
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

    this.renderer.snapshotDefine(name, value, kind);
  }

  resolve(name) {
    const envs = this.getCurrentEnvs();
    return this.variables.resolve(name, envs);
  }

  // ───────────────────────────────
  // Block scoping
  // (kept exactly — but routed through TIME layer later)
  // ───────────────────────────────
  pushBlockEnv() {
    const ctx = this.contexts.currentContext();
    ctx.lexicalEnv = new LexicalEnvironment(ctx.lexicalEnv);
  }

  popBlockEnv() {
    const ctx = this.contexts.currentContext();
    ctx.lexicalEnv = ctx.lexicalEnv.outer;
  }

  printLexChain(prefix = "") {
    this.renderer.printLexChain(prefix);
  }

  // ───────────────────────────────
  // Function calls
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

    // Create new context
    const ctx = this.contexts.callStack.pushContext(
      fn.name,
      fn.closure,
      this.variables.globalVariable
    );

    this.renderer.snapshotCall(fn, args);

    // Bind parameters
    fn.params.forEach((param, i) => {
      ctx.lexicalEnv.define(param, args[i]);
    });

    // Execute function body
    const completion = this.controlFlow.execute(fn.body.body);

    // Pop context
    this.contexts.callStack.popContext();

    return completion ? completion.value : undefined;
  }

  // ───────────────────────────────
  // Execution pipeline
  // ───────────────────────────────
  run(code) {
    this.renderer.phase("PHASE 1 — PARSE");
    const ast = acorn.parse(code, { ecmaVersion: "latest" });
    this.renderer.parsedAST(ast);

    this.renderer.phase("PHASE 2 — INSTANTIATE");
    const { globalLex, globalVar } = this.instantiator.instantiateGlobal(ast);
    this.renderer.globalInstantiationState(globalLex, globalVar); 

    this.renderer.phase("PHASE 3 — CONTEXT CREATE");
    this.contexts.initializeGlobalContext(globalLex, globalVar);
    this.renderer.globalContextState(globalLex, globalVar);

    this.renderer.phase("PHASE 4 — EXECUTE");
    const completion = this.controlFlow.execute(ast.body);

    this.renderer.phase("PHASE 5 — COMPLETE");
    return completion ? completion.value : this.lastValue;
  }

  instantiateBlock(node, blockLex) {
  this.instantiator.instantiateBlock(node, blockLex);
}

prepareBlock(node, parentLex) {
  const blockLex = new LexicalEnvironment(parentLex);
  this.instantiator.instantiateBlock(node, blockLex);
  return blockLex;
}


}
