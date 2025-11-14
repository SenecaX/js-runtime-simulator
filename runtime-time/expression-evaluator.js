import { FunctionObject } from "./function-object.js";

export class ExpressionEvaluator {
  constructor(runtime) {
    this.runtime = runtime;
  }

  evaluate(expr) {
    if (!expr) return undefined;

    switch (expr.type) {
      case "Literal":
        return expr.value;

      case "Identifier":
        return this.runtime.resolve(expr.name);

      case "BinaryExpression":
        return this.evalBinary(expr);

      case "AssignmentExpression":
        return this.evalAssignment(expr);

      case "CallExpression":
        return this.evalCall(expr);

      case "FunctionExpression":
  return this.evalFunctionExpression(expr);


      default:
        return undefined;
    }
  }

evalCall(expr) {
  // 1. Evaluate callee (must be a FunctionObject)
  const callee = this.evaluate(expr.callee);

if (!callee || callee.type !== "FunctionObject") {
  throw new TypeError("CallExpression: callee is not a function");
}


  // 2. Validate argument count BEFORE evaluating arguments
  const expected = callee.params.length;
  const received = expr.arguments.length;

  if (expected !== received) {
throw new TypeError(
  `CallExpression: expected ${expected} arguments but got ${received}`
);

  }

  // 3. Only now evaluate argument expressions
  const args = expr.arguments.map(arg => this.evaluate(arg));

  // 4. Call via RuntimeEngine
  return this.runtime.callFunction(callee, args);
}


  evalBinary(expr) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;

      case "==":
        return left == right;
      case "===":
        return left === right;
      case "!=":
        return left != right;
      case "!==":
        return left !== right;

      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;

      default:
        return undefined;
    }
  }

  evalAssignment(expr) {
    const { operator, left, right } = expr;

    if (left.type !== "Identifier") {
      throw new Error("UC06 supports assignment to simple identifiers only");
    }

    const name = left.name;
    const value = this.evaluate(right);

    if (operator === "=") {
      const envs = this.runtime.getCurrentEnvs();
      this.runtime.variables.update(name, value, envs);
      return value;
    }

    throw new Error(`Operator ${operator} not implemented in UC06`);
  }

  evalFunctionExpression(node) {
  const name = node.id ? node.id.name : null;
  const params = node.params.map(p => p.name);
  const body = node.body;
  const closure = this.runtime.getCurrentEnvs().lexical;

  return new FunctionObject(name, params, body, closure);
}

}
