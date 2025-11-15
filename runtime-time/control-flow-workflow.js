import { ExpressionEvaluator } from "../runtime-time/expression-evaluator.js";
import { FunctionObject } from "./function-object.js";
import { UNINITIALIZED } from "../runtime-time/variable-resolution-workflow.js";

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

    if (!decl.init) {
      if (node.kind === "const") throw new TypeError("Missing initializer in const declaration");
      continue;
    }

    const value = this.evaluator.evaluate(decl.init);

    if (node.kind === "var") {
      this.assignVar(name, value, envs);
      continue;
    }

    if (node.kind === "let") {
      this.initializeTDZ(name, value, envs.lexical, "let");
      continue;
    }

    if (node.kind === "const") {
      this.initializeTDZ(name, value, envs.lexical, "const");
      continue;
    }
  }
}


initializeTDZ(name, value, target, kind) {
  if (target.environmentRecord[name] !== UNINITIALIZED) {
    if (kind === "const") throw new TypeError("Assignment to constant variable.");
    throw new ReferenceError(`Cannot access '${name}' before initialization`);
  }

  target.set(name, value);
  this.runtime.renderSnapshot(`initialize ${name} = ${value} (${kind})`);
}


assignVar(name, value, envs) {
  envs.variable.set(name, value);
  this.runtime.renderSnapshot(`assign ${name} = ${value} (var)`);
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
