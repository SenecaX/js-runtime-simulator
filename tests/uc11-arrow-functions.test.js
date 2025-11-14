import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

function run(code) {
  const rt = new RuntimeEngine();
  rt.init();
  rt.run(code);
  const out = rt.lastValue;
  rt.terminate();
  return out;
}

describe("UC11 — ArrowFunctionExpression", () => {
  it("supports single-expression arrow function: x => x + 1", () => {
    const result = run(`
      const inc = x => x + 1;
      inc(5);
    `);
    expect(result).toBe(6);
  });

  it("supports multi-parameter arrow: (a,b) => a + b", () => {
    const result = run(`
      const add = (a, b) => a + b;
      add(2, 3);
    `);
    expect(result).toBe(5);
  });

  it("supports zero-parameter arrow: () => 42", () => {
    const result = run(`
      const f = () => 42;
      f();
    `);
    expect(result).toBe(42);
  });

  it("supports inline arrow as call argument", () => {
    const result = run(`
      function g(fn) { return fn(10); }
      g(x => x * 2);
    `);
    expect(result).toBe(20);
  });

  it("supports nested arrow invocation: (x => x+1)(4) * 3", () => {
    const result = run(`
      (x => x + 1)(4) * 3;
    `);
    expect(result).toBe(15);
  });

  it("supports block body: x => { const y=x+1; return y*2; }", () => {
    const result = run(`
      const f = x => {
        const y = x + 1;
        return y * 2;
      };
      f(5);
    `);
    expect(result).toBe(12);
  });
});
