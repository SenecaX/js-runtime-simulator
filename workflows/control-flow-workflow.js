import { ExpressionEvaluator } from "../components/expression-evaluator.js";

export class ControlFlowWorkflow {
  constructor(runtime) {
    this.runtime = runtime;
    this.evaluator = new ExpressionEvaluator(runtime);
  }

  execute(body) {
    for (const node of body) this.dispatch(node);
  }

  dispatch(node) {
    if (node.type === "VariableDeclaration") return this.handleVarDecl(node);
  }

  handleVarDecl(node) {
    const envs = this.runtime.getCurrentEnvs();

    for (const decl of node.declarations) {
      const name = decl.id.name;
      const value = decl.init ? this.evaluator.evaluate(decl.init) : undefined;
      this.runtime.define(name, value, node.kind, envs);
    }
  }
}
