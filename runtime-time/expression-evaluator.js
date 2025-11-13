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
}
