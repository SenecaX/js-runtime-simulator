export class LexicalEnvironment {
  constructor(outer = null) {
    this.environmentRecord = {};
    this.outer = outer;
  }

  define(name, value) {
    this.environmentRecord[name] = value;
  }

  set(name, value) {
    if (name in this.environmentRecord) {
      this.environmentRecord[name] = value;
    } else if (this.outer) {
      this.outer.set(name, value);
    } else {
      throw new ReferenceError(`${name} is not defined`);
    }
  }

  lookup(name) {
    if (name in this.environmentRecord) return this.environmentRecord[name];
    if (this.outer) return this.outer.lookup(name);
    return undefined;
  }
}
