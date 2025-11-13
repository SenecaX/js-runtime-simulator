export class EnvironmentRouter {
  constructor(globalLexical, globalVariable) {
    this.globalLexical = globalLexical;
    this.globalVariable = globalVariable;
  }

  // Decide which environment receives the binding
  select(kind, envs) {
    const isVar  = kind === "var";
    const isLet  = kind === "let";
    const isConst = kind === "const";

    const lexicalEnv = envs.lexical;
    const variableEnv = envs.variable;

    // var → variable environment
    if (isVar) return variableEnv;

    // let/const → lexical environment
    if (isLet || isConst) return lexicalEnv;

    // default fallback (not used in UC01)
    return lexicalEnv;
  }
}
