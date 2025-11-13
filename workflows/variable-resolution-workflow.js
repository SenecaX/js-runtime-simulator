import { LexicalEnvironment } from "../mechanisms/lexical-environment.js";

export class VariableResolutionWorkflow {
  constructor() {
    this.globalLexical = new LexicalEnvironment();
  }

  define(name, value, kind, envs) {
    const target = kind === "let" ? envs.lexical : envs.variable;
    target.define(name, value);
  }

  resolve(name, envs) {
    return envs.lexical.lookup(name);
  }
}
