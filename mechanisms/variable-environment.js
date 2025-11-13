export class VariableEnvironment {
  constructor(outer = null) {
    this.environmentRecord = {};
    this.outer = outer;
  }

  define(name, value) {
    this.environmentRecord[name] = value;
  }

  lookup(name) {
    if (name in this.environmentRecord) return this.environmentRecord[name];
    if (this.outer) return this.outer.lookup(name);
    return undefined;
  }
}
