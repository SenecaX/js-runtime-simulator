import { ExpressionEvaluator } from "../runtime-time/expression-evaluator.js";

export class ControlFlowWorkflow {
  constructor(runtime) {
    this.runtime = runtime;
    this.evaluator = new ExpressionEvaluator(runtime);
  }

  execute(body) {
    for (const node of body) {
      this.dispatch(node);
    }
  }

  dispatch(node) {
    if (node.type === "VariableDeclaration") {
      return this.handleVarDecl(node);
    }

    if (node.type === "BlockStatement") {
      return this.handleBlock(node);
    }
  }

  handleVarDecl(node) {
    const envs = this.runtime.getCurrentEnvs();

    for (const decl of node.declarations) {
      const name = decl.id.name;
      const value = decl.init ? this.evaluator.evaluate(decl.init) : undefined;

      this.runtime.define(name, value, node.kind, envs);
    }
  }

  handleBlock(node) {
    this.runtime.pushBlockEnv();
    for (const stmt of node.body) {
      this.dispatch(stmt);
    }
    this.runtime.popBlockEnv();
  }
}
