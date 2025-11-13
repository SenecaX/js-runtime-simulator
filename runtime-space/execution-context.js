import { LexicalEnvironment } from "../runtime-space/lexical-environment.js";
import { VariableEnvironment } from "../runtime-space/variable-environment.js";

export class ExecutionContext {
  constructor(name, outerLexical = null, outerVariable = null, depth = 0) {
    this.name = name;
    this.lexicalEnv = new LexicalEnvironment(outerLexical);
    this.variableEnv = new VariableEnvironment(outerVariable);
    this.depth = depth;
  }

  summary() {
    return `${this.name} (Depth: ${this.depth})`;
  }
}
