// runtime-time/context-lifecycle-workflow.js
import { CallStack } from "../runtime-space/call-stack.js";

export class ContextLifecycleWorkflow {
  constructor() {
    this.callStack = new CallStack();

    this.globalLex = null;
    this.globalVar = null;
  }

  initializeGlobalContext(injectedLex, injectedVar) {
    // Store injected envs
    this.globalLex = injectedLex;
    this.globalVar = injectedVar;

    // Push the Global Execution Context using exactly these envs
    this.callStack.pushContext(
      "Global",
      null,
      null,
      0, // depth
      injectedLex, // injected lexical env
      injectedVar // injected var env
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
