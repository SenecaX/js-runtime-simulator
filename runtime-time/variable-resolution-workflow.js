// runtime-time/variable-resolution-workflow.js
import { LexicalEnvironment } from "../runtime-space/lexical-environment.js";
import { VariableEnvironment } from "../runtime-space/variable-environment.js";
import { ScopeChain } from "../runtime-space/scope-chain.js";
import { EnvironmentRouter } from "../runtime-time/environment-router.js";

export const UNINITIALIZED = Symbol("UNINITIALIZED");

export class VariableResolutionWorkflow {
  constructor() {
    // Unified global environments (UC12 requirement)
    this.globalLexical = new LexicalEnvironment(null);
    this.globalVariable = new VariableEnvironment(null);

    this.router = new EnvironmentRouter(
      this.globalLexical,
      this.globalVariable
    );
  }

  // ────────────────────────────────────────────────
  // DECLARATION INSTANTIATION PHASE ("define")
  // UC12 requires that define() uses the router but
  // DOES NOT initialize let/const — they receive UNINITIALIZED.
  // ────────────────────────────────────────────────
define(name, value, kind, envs) {
  const target = this.router.select(kind, envs);

  if (kind === "let" || kind === "const") {
    target.define(name, UNINITIALIZED);
    return;
  }

  if (kind === "function") {
    // fully initialized at instantiation
    target.define(name, value);
    return;
  }

  // var
  target.define(name, undefined);
}


  // ────────────────────────────────────────────────
  // RESOLUTION (Identifier)
  // UC12: TDZ MUST throw if accessed before initialization.
  // ────────────────────────────────────────────────
resolve(name, envs) {
  //
  // 1. lexical chain first (let, const, function)
  //
  let env = envs.lexical;
  while (env) {
    if (name in env.environmentRecord) {
      const value = env.environmentRecord[name];

      if (value === UNINITIALIZED) {
        throw new ReferenceError(`${name} is not initialized`);
      }

      return value;
    }
    env = env.outer;
  }

  //
  // 2. variable chain (var + function hoisting)
  //
  env = envs.variable;
  while (env) {
    if (name in env.environmentRecord) {
      // var bindings are always initialized to undefined
      return env.environmentRecord[name];
    }
    env = env.outer;
  }

  //
  // 3. not found
  //
  throw new ReferenceError(`${name} is not defined`);
}


  // ────────────────────────────────────────────────
  // UPDATE (Assignment)
  // UC12: assignment must ALSO reject TDZ cases.
  // ────────────────────────────────────────────────
  update(name, value, envs) {
    // 1. lexical chain
    let env = envs.lexical;
    while (env) {
      if (name in env.environmentRecord) {
        if (env.environmentRecord[name] === UNINITIALIZED) {
          throw new ReferenceError(
            `${name} is assigned before initialization (TDZ)`
          );
        }
        env.set(name, value);
        return value;
      }
      env = env.outer;
    }

    // 2. var chain
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
