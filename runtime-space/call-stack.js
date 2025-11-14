import { Stack } from "../core/stack.js";
import { ExecutionContext } from "./execution-context.js";

export class CallStack {
  constructor() {
    this.stack = new Stack();
  }

  pushContext(name, closureLex = null, closureVar = null) {
    const prev = this.stack.peek();
    const depth = this.stack.length;

    // If closure is provided → function call context
    if (closureLex !== null || closureVar !== null) {
      const ctx = new ExecutionContext(name, closureLex, closureVar, depth);
      this.stack.push(ctx);
      return ctx;
    }

    // Otherwise → normal lexical inheritance (global / blocks)
    const outerLex = prev ? prev.lexicalEnv : null;
    const outerVar = prev ? prev.variableEnv : null;

    const ctx = new ExecutionContext(name, outerLex, outerVar, depth);
    this.stack.push(ctx);
    return ctx;
  }

  popContext() {
    return this.stack.pop();
  }

  peekContext() {
    return this.stack.peek();
  }

  printStack() {
    return this.stack.items;
  }
}
