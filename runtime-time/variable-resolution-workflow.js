import { LexicalEnvironment } from "../runtime-space/lexical-environment.js";
import { VariableEnvironment } from "../runtime-space/variable-environment.js";
import { ScopeChain } from "../runtime-space/scope-chain.js";
import { EnvironmentRouter } from "../runtime-time/environment-router.js";

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

  update(name, value, envs) {
  // 1. lexical chain first
  let env = envs.lexical;
  while (env) {
    if (name in env.environmentRecord) {
      env.set(name, value);
      return value;
    }
    env = env.outer;
  }

  // 2. fallback to variable chain
  env = envs.variable;
  while (env) {
    if (name in env.environmentRecord) {
      env.set(name, value);
      return value;
    }
    env = env.outer;
  }

  // 3. not found
  throw new ReferenceError(`${name} is not defined`);
}

}
