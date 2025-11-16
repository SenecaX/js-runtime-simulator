// ui/engine-renderer.js
import { TerminalRenderer as T } from "./terminal-renderer.js";

export class EngineRenderer {
  constructor(engine) {
    this.engine = engine;
  }

  // ───────────────────────────────
  // Snapshots
  // ───────────────────────────────
  snapshotDefine(name, value, kind) {
    const safe =
      value && value.type === "FunctionObject"
        ? `[FunctionObject ${value.name}]`
        : JSON.stringify(value);

    this.snapshot(`define ${name} = ${safe} (${kind})`);
  }

  snapshotCall(fn, args) {
    this.snapshot(`call ${fn.name}(${args.join(", ")})`);
  }

  snapshot(action) {
    const ctx = this.engine.contexts.currentContext();
    const envs = this.engine.getCurrentEnvs();
    const frames = this.engine.contexts.callStack.printStack();

    console.log(`ACTION: ${action}`);
    console.log("-".repeat(40));

    console.log(
      T.block("CALL STACK (execution contexts)", T.formatCallStack(frames))
    );

    console.log(
      T.block("LEXICAL SCOPE CHAIN", T.formatLexicalChain(envs.lexical))
    );

    console.log(
      T.block("VARIABLE SCOPE CHAIN", T.formatVariableChain(envs.variable))
    );

    console.log("-".repeat(40));
  }

  // ───────────────────────────────
  // Phase rendering
  // ───────────────────────────────
  phase(name) {
    console.log(`\n──────── ${name} ────────`);
  }

  // ───────────────────────────────
  // AST rendering
  // ───────────────────────────────
  parsedAST(ast) {
    console.log("AST (Program.body):", ast.body);
  }

  // ───────────────────────────────
  // Global context
  // ───────────────────────────────
  globalContextState(globalLex, globalVar) {
    console.log("CALL STACK:", this.engine.contexts.callStack.printStack());
    console.log("GLOBAL LEXICAL:", globalLex.environmentRecord);
    console.log("GLOBAL VARIABLE:", globalVar.environmentRecord);
    console.log("----------------------------------------");
  }

  // ───────────────────────────────
  // Debug helpers
  // ───────────────────────────────
  printLexChain(prefix = "") {
    let env = this.engine.contexts.currentContext().lexicalEnv;
    let i = 0;

    console.log(prefix + "LEXICAL CHAIN:");
    while (env) {
      console.log(`  [${i}]`, JSON.stringify(env.environmentRecord));
      env = env.outer;
      i++;
    }
    console.log("--------------");
  }

  globalInstantiationState(globalLex, globalVar) {
  console.log("INSTANTIATED GLOBAL LEXICAL:", globalLex.environmentRecord);
  console.log("INSTANTIATED GLOBAL VARIABLE:", globalVar.environmentRecord);
  console.log("----------------------------------------");
}

}
