export class FunctionObject {
  constructor(name, params, body, closure) {
    this.type = "FunctionObject";
    this.name = name || "<arrow>";
    this.params = params;
    this.body = body;
    this.closure = closure;
  }
}
