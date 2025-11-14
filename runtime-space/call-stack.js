import { Stack } from "../core/stack.js";
import { ExecutionContext } from "./execution-context.js";

export class CallStack {
  constructor() {
    this.stack = new Stack();
  }

  /**
   * Correct UC12 signature:
   * pushContext(name, closureLex, closureVar, depth, injectedLex, injectedVar)
   *
   * All arguments MUST be aligned because ExecutionContext expects:
   *   (name, outerLex, outerVar, depth, injectedLex, injectedVar)
   */
  pushContext(
    name,
    closureLex = null,
    closureVar = null,
    depth = null,
    injectedLex = null,
    injectedVar = null
  ) {
    const prev = this.stack.peek();
    const actualDepth = this.stack.length;

    // Auto-assign depth if not provided
    if (depth === null) depth = actualDepth;

    // ────────────────────────────────────────────────
    // 1. Function call (when closureLex OR closureVar is provided)
    // ────────────────────────────────────────────────
    if (closureLex !== null || closureVar !== null) {
      const ctx = new ExecutionContext(
        name,
        closureLex,
        closureVar,
        depth,
        null,         // injectedLex
        null          // injectedVar
      );
      this.stack.push(ctx);
      return ctx;
    }

    // ────────────────────────────────────────────────
    // 2. Global execution context (UC12 injectedLex/injectedVar)
    // ────────────────────────────────────────────────
    if (injectedLex !== null || injectedVar !== null) {
      const ctx = new ExecutionContext(
        name,
        null,
        null,
        depth,
        injectedLex,
        injectedVar
      );
      this.stack.push(ctx);
      return ctx;
    }

    // ────────────────────────────────────────────────
    // 3. Normal block/lexical inheritance
    // ────────────────────────────────────────────────
    const outerLex = prev ? prev.lexicalEnv : null;
    const outerVar = prev ? prev.variableEnv : null;

    const ctx = new ExecutionContext(
      name,
      outerLex,
      outerVar,
      depth,
      null,
      null
    );

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
