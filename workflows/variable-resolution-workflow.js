import { LexicalEnvironment } from "../mechanisms/lexical-environment.js";
import { VariableEnvironment } from "../mechanisms/variable-environment.js";
import { ScopeChain } from "../mechanisms/scope-chain.js";
import { EnvironmentRouter } from "../components/environment-router.js";

export class VariableResolutionWorkflow {
  constructor() {
    // Global base environments
    this.globalLexical = new LexicalEnvironment();
    this.globalVariable = new VariableEnvironment();

    // Router decides where let/var/const go
    this.router = new EnvironmentRouter(
      this.globalLexical,
      this.globalVariable
    );
  }

  define(name, value, kind, envs) {
    const target = this.router.select(kind, envs);
    target.define(name, value);
  }

  resolve(name, envs) {
    try {
      // lexical first
      return ScopeChain.lookup(name, envs.lexical);
    } catch {
      // fallback to var space
      try {
        return ScopeChain.lookup(name, envs.variable);
      } catch {
        return undefined;
      }
    }
  }
}
