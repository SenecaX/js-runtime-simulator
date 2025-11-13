import { Stack } from "../core/stack.js";
import { ExecutionContext } from "./execution-context.js";

export class CallStack {
  constructor() {
    this.stack = new Stack();
  }

  pushContext(name) {
    const prev = this.stack.peek();
    const outerLex = prev ? prev.lexicalEnv : null;
    const outerVar = prev ? prev.variableEnv : null;
    const depth = this.stack.length;

    const ctx = new ExecutionContext(name, outerLex, outerVar, depth);
    this.stack.push(ctx);
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
