export class ExpressionEvaluator {
  constructor(runtime) {
    this.runtime = runtime;
  }

  evaluate(expr) {
    if (expr.type === "Literal") return expr.value;
    if (expr.type === "Identifier") return this.runtime.resolve(expr.name);
    return undefined;
  }
}
