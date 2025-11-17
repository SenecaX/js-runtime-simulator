// tests/uc14-block-decl-instantiation.test.js
import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../core/engine/runtime-engine.js";

function run(code) {
  const engine = new RuntimeEngine();
  return engine.run(code);
}

describe("UC14 — Block Declaration Instantiation Phase Correction", () => {

  it("TC1 — TDZ before let initialization inside block", () => {
    expect(() => run(`
      {
        x;
        let x = 1;
      }
    `)).toThrowError(ReferenceError);
  });

  it("TC2 — inner block shadows outer", () => {
    const result = run(`
      let x = 1;
      {
        let x = 2;
        x;
      }
    `);
    expect(result).toBe(2);
  });

  it("TC3 — outer preserved after block", () => {
    const result = run(`
      let x = 1;
      {
        let x = 2;
      }
      x;
    `);
    expect(result).toBe(1);
  });

  it("TC4 — block-scoped function shadows outer", () => {
    const result = run(`
      function f() { return 1 }
      {
        function f() { return 2 }
        f();
      }
    `);
    expect(result).toBe(2);
  });

  it("TC5 — nested blocks inherit correctly", () => {
    const result = run(`
      {
        let x = 1;
        {
          x;
        }
      }
    `);
    expect(result).toBe(1);
  });

  it("TC6 — block-scoped const TDZ", () => {
    expect(() => run(`
      {
        y;
        const y = 5;
      }
    `)).toThrowError(ReferenceError);
  });

  it("TC7 — let declared later in nested block still TDZ", () => {
    expect(() => run(`
      {
        let x = 1;
        {
          y;
          let y = x + 1;
        }
      }
    `)).toThrowError(ReferenceError);
  });

  it("TC8 — multiple declarations inside block handled before execution", () => {
    const result = run(`
      {
        let a = 1;
        const b = 2;
        function c() { return a + b }
        c();
      }
    `);
    expect(result).toBe(3);
  });

  it("TC9 — redeclaring let inside same block still throws SyntaxError (future UC, skip for now)", () => {
    // optional: skip for now because syntax errors require parser transform
  });

});
