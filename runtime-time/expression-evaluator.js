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


      default:
        return undefined;
    }
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

}
