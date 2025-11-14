import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC10 — Full lastValue propagation
//

describe("UC10 — lastValue propagation", () => {
  let runtime;

  beforeEach(() => {
    runtime = new RuntimeEngine();
    runtime.init();
  });

  afterEach(() => {
    runtime.terminate();
  });

  // 1. literal
  it("updates lastValue for literals", () => {
    runtime.run(`5;`);
    expect(runtime.lastValue).toBe(5);
  });

  // 2. identifier lookup
  it("updates lastValue for identifier lookup", () => {
    runtime.run(`
      let x = 10;
      x;
    `);
    expect(runtime.lastValue).toBe(10);
  });

  // 3. binary expression
  it("updates lastValue for binary expressions", () => {
    runtime.run(`1 + 2;`);
    expect(runtime.lastValue).toBe(3);
  });

  // 4. direct function call
  it("updates lastValue for direct function return value", () => {
    runtime.run(`
      function f() { return 99; }
      f();
    `);
    expect(runtime.lastValue).toBe(99);
  });

  // 5. nested calls
  it("updates lastValue for nested call expressions", () => {
    runtime.run(`
      function add(a, b) { return a + b; }
      function mul(x) { return x * 3; }
      mul(add(2, 3));
    `);
    expect(runtime.lastValue).toBe(15);
  });

  // 6. return inside function without top-level expr
  it("does NOT update lastValue without a top-level expression", () => {
    runtime.run(`
      function f() { return 77; }
      // no top-level expression
    `);
    expect(runtime.lastValue).toBe(undefined);
  });

  // 7. lastValue should update for ANY top-level expression, not only ExpressionStatement
  it("top-level expression should override previous lastValue", () => {
    runtime.run(`
      let x = 1;
      let y = 2;
      x + y;
    `);
    expect(runtime.lastValue).toBe(3);
  });

  // 8. assignment result should update lastValue
  it("assignment expression should update lastValue", () => {
    runtime.run(`
      let a = 5;
      a = a + 2;
    `);
    expect(runtime.lastValue).toBe(7);
  });

  // 9. ensure lastValue updates for nested binary expressions
  it("lastValue updates for nested binary expressions", () => {
    runtime.run(`
      (1 + 2) * (3 + 4);
    `);
    expect(runtime.lastValue).toBe(21);
  });

  // 10. ensure lastValue updates for function expression call
  it("updates lastValue for inline function expressions", () => {
    runtime.run(`
      (function(x){ return x + 10; })(5);
    `);
    expect(runtime.lastValue).toBe(15);
  });
});
