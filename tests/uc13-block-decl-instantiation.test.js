import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../core/engine/runtime-engine.js";

// Helper
function run(code) {
  const engine = new RuntimeEngine();
  return engine.run(code);
}

describe("UC13 — BlockDeclarationInstantiation", () => {

  // ──────────────────────────────────────────────
  // TDZ (Temporal Dead Zone)
  // ──────────────────────────────────────────────
  it("throws ReferenceError when accessing let before initialization", () => {
    const code = `
    {
      x;       // TDZ
      let x = 1;
    }
    `;
    expect(() => run(code)).toThrow(/Cannot access 'x' before initialization/);
  });

  it("throws ReferenceError when accessing const before initialization", () => {
    const code = `
    {
      y;       // TDZ
      const y = 2;
    }
    `;
    expect(() => run(code)).toThrow(/Cannot access 'y' before initialization/);
  });

  // ──────────────────────────────────────────────
  // Shadowing
  // ──────────────────────────────────────────────
  it("supports let shadowing inside nested blocks", () => {
    const code = `
    let x = 1;
    {
      let x = 2;
      x;
    }
    `;
    expect(run(code)).toBe(2);
  });

  // ──────────────────────────────────────────────
  // Nested lexical environments
  // ──────────────────────────────────────────────
  it("supports multiple nested blocks with correct lexical layering", () => {
    const code = `
    let a = 1;
    {
      let a = 2;
      {
        const a = 3;
        a;      // should be 3
      }
    }
    `;
    expect(run(code)).toBe(3);
  });

  // ──────────────────────────────────────────────
  // Const assignment rules
  // ──────────────────────────────────────────────
  it("throws TypeError on reassigning const", () => {
    const code = `
    {
      const z = 10;
      z = 20;        // ❌
    }
    `;
    expect(() => run(code)).toThrow(/constant variable/);
  });

  // ──────────────────────────────────────────────
  // Block-scoped function declarations
  // ──────────────────────────────────────────────
  it("hoists block-scoped functions and initializes them before execution", () => {
    const code = `
    {
      f();              // should work — block function is hoisted
      function f() { return 42; }
    }
    `;
    expect(run(code)).toBe(42);
  });

  it("block-scoped function shadows outer functions", () => {
    const code = `
    function f() { return 1; }

    {
      function f() { return 2; }
      f();          // 2
    }
    `;
    expect(run(code)).toBe(2);
  });

  // ──────────────────────────────────────────────
  // var is NOT block scoped
  // ──────────────────────────────────────────────
  it("var does not belong to block lexical environment", () => {
    const code = `
    {
      var q = 5;
    }
    q;    // should exist
    `;
    expect(run(code)).toBe(5);
  });

});
