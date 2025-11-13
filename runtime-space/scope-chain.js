export class ScopeChain {
  static lookup(name, startEnv) {
    let env = startEnv;

    while (env) {
      if (name in env.environmentRecord) {
        return env.environmentRecord[name];
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
