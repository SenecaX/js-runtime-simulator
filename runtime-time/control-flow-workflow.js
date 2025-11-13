import { ExpressionEvaluator } from "../runtime-time/expression-evaluator.js";
import { FunctionObject } from "./function-object.js";

export class ControlFlowWorkflow {
  constructor(runtime) {
    this.runtime = runtime;
    this.evaluator = new ExpressionEvaluator(runtime);
  }

  execute(body) {
    for (const node of body) {
      const result = this.dispatch(node);

      // stop execution if return reached
      if (result && result.type === "return") {
        return result;
      }
    }
  }

  dispatch(node) {
    if (node.type === "FunctionDeclaration") {
      return this.handleFunctionDeclaration(node);
    }

    if (node.type === "VariableDeclaration") {
      return this.handleVarDecl(node);
    }

    if (node.type === "BlockStatement") {
      return this.handleBlock(node);
    }

    if (node.type === "ReturnStatement") {
      const value = node.argument
        ? this.evaluator.evaluate(node.argument)
        : undefined;

      return { type: "return", value };
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
      const result = this.dispatch(stmt);

      // Bubble return upward
      if (result && result.type === "return") {
        this.runtime.popBlockEnv();
        return result;
      }
    }

    this.runtime.popBlockEnv();
  }

  handleFunctionDeclaration(node) {
  const name = node.id.name;
  const params = node.params.map(p => p.name);
  const body = node.body;
  const closure = this.runtime.getCurrentEnvs().lexical;

  const fn = new FunctionObject(name, params, body, closure);

  // bind function into lexical environment (not var env)
  closure.define(name, fn);

  this.runtime.renderSnapshot(`define function ${name}`);
  return fn;
}

}
