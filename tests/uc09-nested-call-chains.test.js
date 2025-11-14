import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC09 — Nested Call Chains
//

describe("UC09 - Nested Call Chains", () => {
  let runtime;

  beforeEach(() => {
    runtime = new RuntimeEngine();
    runtime.init();
  });

  afterEach(() => {
    runtime.terminate();
  });

  // -----------------------------------------
  // TC1 — Simple nested: g → f
  // -----------------------------------------
  it("computes g(5) where g calls f internally", () => {
    runtime.run(`
      function f(x) { return x + 1; }
      function g(y) { return f(y) * 2; }
      g(5);
    `);

    expect(runtime.lastValue).toBe(12);
  });

  // -----------------------------------------
  // TC2 — Multi-depth: c → b → a
  // -----------------------------------------
  it("supports multi-level nested calls (c → b → a)", () => {
    runtime.run(`
      function a(x) { return x + 1; }
      function b(y) { return a(y) * 2; }
      function c(z) { return b(z) + 3; }
      c(4);
    `);

    expect(runtime.lastValue).toBe(13);
  });

  // -----------------------------------------
  // TC3 — Nested call where outer does not return
  // -----------------------------------------
  it("outer function returns undefined when only inner returns", () => {
    runtime.run(`
      function f(x) { return x + 1; }
      function g(y) { f(y); }   // no return
      g(10);
    `);

    expect(runtime.lastValue).toBe(undefined);
  });

  // -----------------------------------------
  // TC4 — CallStack cleanup
  // -----------------------------------------
  it("leaves only the global frame after nested calls complete", () => {
    runtime.run(`
      function f(x) { return x + 1; }
      function g(y) { return f(y); }
      g(20);
    `);

    // global frame = depth 0 → stack.items.length = 1
    const stackDepth = runtime.contexts.callStack.stack.items.length;

    expect(stackDepth).toBe(1);
  });
});
