import * as acorn from "acorn";
import { VariableResolutionWorkflow } from "../workflows/variable-resolution-workflow.js";
import { ControlFlowWorkflow } from "../workflows/control-flow-workflow.js";

export class RuntimeEngine {
  constructor() {
    this.variables = new VariableResolutionWorkflow();
    this.controlFlow = new ControlFlowWorkflow(this);

    this.globalEnvs = {
      lexical: this.variables.globalLexical,
      variable: this.variables.globalLexical // unused in UC01
    };
  }

  getCurrentEnvs() {
    return this.globalEnvs;
  }

  define(name, value, kind, envs) {
    this.variables.define(name, value, kind, envs);
  }

  resolve(name, envs = this.globalEnvs) {
    return this.variables.resolve(name, envs);
  }

  run(code) {
    const ast = acorn.parse(code, { ecmaVersion: "latest" });
    this.controlFlow.execute(ast.body);
  }
}
