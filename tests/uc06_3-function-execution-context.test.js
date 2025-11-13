import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

describe("UC06.3 — Function Execution Context", () => {

  it("executes a simple function with parameters", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    runtime.run(`
      function add(a, b) {
        return a + b;
      }
      add(2, 3);
    `);

    expect(runtime.lastValue).toBe(5);
  });

  it("captures lexical closure", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    runtime.run(`
      let x = 10;
      function f() {
        return x + 1;
      }
      f();
    `);

    expect(runtime.lastValue).toBe(11);
  });

  it("creates distinct execution contexts for nested calls", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    runtime.run(`
      function f(x) {
        return x + 1;
      }
      function g(y) {
        return f(y * 2);
      }
      g(5);
    `);

    // g(5) → f(10) → 11
    expect(runtime.lastValue).toBe(11);
  });

});
