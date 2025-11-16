import { UNINITIALIZED } from "../runtime-time/variable-resolution-workflow.js";

export class ScopeChain {
  static lookup(name, startEnv) {
    let env = startEnv;

    while (env) {
      if (name in env.environmentRecord) {
        const value = env.environmentRecord[name];

        // TDZ detection happens here
        if (value === UNINITIALIZED) {
          throw new ReferenceError(
            `${name} is accessed before initialization (TDZ)`
          );
        }

        return value;
      }

      env = env.outer;
    }

    throw new ReferenceError(`${name} is not defined`);
  }

  static print(startEnv) {
    let env = startEnv;
    const chain = [];
    while (env) {
      chain.push(Object.keys(env.environmentRecord));
      env = env.outer;
    }
    console.log(chain);
  }
}
