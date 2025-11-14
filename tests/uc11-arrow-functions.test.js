import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC11 — ArrowFunctionExpression
//

describe("UC11 — ArrowFunctionExpression", () => {
  let runtime;

  beforeEach(() => {
    runtime = new RuntimeEngine();
    runtime.init();
  });

  afterEach(() => {
    runtime.terminate();
  });

  // 1. Single param — single expression
  it("evaluates x => x + 1", () => {
    runtime.run(`
      const inc = x => x + 1;
      inc(5);
    `);

    expect(runtime.lastValue).toBe(6);
  });

  // 2. Multi-param — single expression
  it("evaluates (a,b) => a + b", () => {
    runtime.run(`
      const add = (a,b) => a + b;
      add(2, 3);
    `);

    expect(runtime.lastValue).toBe(5);
  });

  // 3. Block body arrow
  it("evaluates x => { const y=x*2; return y+1; }", () => {
    runtime.run(`
      const f = x => { const y = x * 2; return y + 1; };
      f(10);
    `);

    expect(runtime.lastValue).toBe(21);
  });

  // 4. Inline arrow invocation
  it("evaluates (x => x*3)(4)", () => {
    runtime.run(`
      (x => x * 3)(4);
    `);

    expect(runtime.lastValue).toBe(12);
  });

  // 5. Arrow passed as callback
  it("evaluates arrow passed as argument", () => {
    runtime.run(`
      const apply = (fn, v) => fn(v);
      apply(x => x + 10, 7);
    `);

    expect(runtime.lastValue).toBe(17);
  });

  // 6. Arrow returning arrow
  it("supports arrow returning another arrow", () => {
    runtime.run(`
      const outer = a => b => a + b;
      outer(3)(4);
    `);

    expect(runtime.lastValue).toBe(7);
  });

  // 7. Arrow capturing outer lexical closure
  it("captures closure correctly", () => {
    runtime.run(`
      const a = 10;
      const f = x => x + a;
      f(5);
    `);

    expect(runtime.lastValue).toBe(15);
  });

});
