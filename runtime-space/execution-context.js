// runtime-space/execution-context.js
import { LexicalEnvironment } from "../runtime-space/lexical-environment.js";
import { VariableEnvironment } from "../runtime-space/variable-environment.js";

export class ExecutionContext {
  constructor(
    name,
    outerLexical = null,
    outerVariable = null,
    depth = 0,
    injectedLex = null,
    injectedVar = null
  ) {
    this.name = name;
    this.depth = depth;

    // UC12 GLOBAL CONTEXT
    if (injectedLex !== null || injectedVar !== null) {
      this.lexicalEnv = injectedLex ?? new LexicalEnvironment(outerLexical);
      this.variableEnv = injectedVar ?? new VariableEnvironment(outerVariable);
      return;
    }

    // FUNCTION CONTEXT (closure)
    if (outerLexical !== null || outerVariable !== null) {
      this.lexicalEnv = new LexicalEnvironment(outerLexical); // outer = closure.lex
      this.variableEnv = new VariableEnvironment(outerVariable); // outer = globalVar
      return;
    }

    // SHOULD NEVER BE USED except pre-UC12 global
    this.lexicalEnv = new LexicalEnvironment(null);
    this.variableEnv = new VariableEnvironment(null);
  }

  summary() {
    return `${this.name} (Depth: ${this.depth})`;
  }
}