import { CallStack } from "../components/call-stack.js";

export class ContextLifecycleWorkflow {
  constructor() {
    this.callStack = new CallStack();
  }

  // Create Global Execution Context
  initializeGlobalContext() {
    this.callStack.pushContext("Global");
  }

  // No function context handling for UC01, but keep API for future
  enterFunction(name) {
    this.callStack.pushContext(name);
  }

  exitFunction() {
    this.callStack.popContext();
  }

  terminate() {
    this.callStack.popContext(); // remove Global frame
  }

  currentContext() {
    return this.callStack.peekContext();
  }
}
