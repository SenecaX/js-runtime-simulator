import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

describe("UC08 — FunctionExpression", () => {
  it("returns a FunctionObject when evaluating a function expression", () => {
    const r = new RuntimeEngine();
    r.init();

    r.run(`const f = function(a, b) { return a + b; };`);
    const result = r.resolve("f");

    expect(result).toBeDefined();
    expect(result.type).toBe("FunctionObject");
    expect(result.params).toEqual(["a", "b"]);
    expect(result.body.type).toBe("BlockStatement");

    r.terminate();
  });

  it("allows calling a FunctionExpression immediately", () => {
    const r = new RuntimeEngine();
    r.init();

    r.run(`(function(x) { return x * 2; })(5);`);
    expect(r.lastValue).toBe(10);

    r.terminate();
  });

  it("captures closure correctly", () => {
    const r = new RuntimeEngine();
    r.init();

    r.run(`
      let x = 10;
      const f = function() { return x + 1; };
      f();
    `);

    expect(r.lastValue).toBe(11);

    r.terminate();
  });

  it("supports named function expressions", () => {
    const r = new RuntimeEngine();
    r.init();

    r.run(`const f = function g() { return 7; }; f();`);
    expect(r.lastValue).toBe(7);

    r.terminate();
  });
});
