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
    this.renderSnapshot(`define ${name} = ${JSON.stringify(value)} (${kind})`);
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

    console.log(T.block("LexicalEnv", T.formatEnv(envs.lexical)));

    console.log(T.block("VariableEnv", T.formatEnv(envs.variable)));

    console.log("-".repeat(40));
  }
}
