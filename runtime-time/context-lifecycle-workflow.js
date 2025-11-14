// runtime-time/context-lifecycle-workflow.js
import { CallStack } from "../runtime-space/call-stack.js";

export class ContextLifecycleWorkflow {
  constructor() {
    this.callStack = new CallStack();

    this.globalLex = null; // UC12 injected lexical env
    this.globalVar = null; // UC12 injected var env
  }

  /**
   * UC12–correct version:
   * The Global Execution Context must directly use the already-created
   * global lexical (let/const/function) and global variable (var) environments.
   *
   * No new LexicalEnvironment/VariableEnvironment may be created here.
   */
  initializeGlobalContext(injectedLex, injectedVar) {
    // Store injected envs
    this.globalLex = injectedLex;
    this.globalVar = injectedVar;

    // Push the Global Execution Context using exactly these envs
this.callStack.pushContext(
  "Global",
  null,
  null,
  0,              // depth
  injectedLex,    // injected lexical env
  injectedVar     // injected var env
);

  }

  enterFunction(name) {
    this.callStack.pushContext(name);
  }

  exitFunction() {
    this.callStack.popContext();
  }

  terminate() {
    this.callStack.popContext();
  }

  currentContext() {
    return this.callStack.peekContext();
  }
}
