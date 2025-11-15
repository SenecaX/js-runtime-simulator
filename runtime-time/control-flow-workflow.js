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

      if (result && result.type === "return") {
        return result;
      }
    }
  }

  dispatch(node) {
    // IMPORTANT — UC12:
    // FunctionDeclaration is *ignored* during execution.
    if (node.type === "FunctionDeclaration") {
      return; // Already hoisted + initialized in instantiation phase
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

    if (node.type === "ExpressionStatement") {
      const value = this.evaluator.evaluate(node.expression);
      this.runtime.lastValue = value;
      return value;
    }
  }

  handleVarDecl(node) {
    const envs = this.runtime.getCurrentEnvs();

    for (const decl of node.declarations) {
      const name = decl.id.name;

      // No initializer → nothing to execute
      if (!decl.init) continue;

      const value = this.evaluator.evaluate(decl.init);

      // var: assignment to existing binding
      if (node.kind === "var") {
        this.runtime.variables.update(name, value, envs);
        continue;
      }

      // let/const: first write initializes TDZ binding
      // This is the ES "InitializeBinding" step
      const target = envs.lexical;

      if (target.environmentRecord[name] !== undefined) {
        // replace UNINITIALIZED with real value
        target.set(name, value);

        // PHASE 4 — EXECUTE"
        this.runtime.renderSnapshot(`initialize ${name} = ${value} (${node.kind})`);
        continue;
      }

      // Should never reach here unless malformed AST
    }
  }

  handleBlock(node) {
    this.runtime.pushBlockEnv();

    for (const stmt of node.body) {
      const result = this.dispatch(stmt);

      if (result && result.type === "return") {
        this.runtime.popBlockEnv();
        return result;
      }
    }

    this.runtime.popBlockEnv();
  }
}
