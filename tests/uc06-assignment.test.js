import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC06 — Assignment (x = 5)
//

describe("UC06 - AssignmentExpression", () => {
  let runtime;

  beforeEach(() => {
    runtime = new RuntimeEngine();
    runtime.init();
  });

  afterEach(() => {
    runtime.terminate();
  });

  // ───────────────────────────────────────────
  // 1. Simple assignment updates existing binding
  // ───────────────────────────────────────────
  it("updates an existing lexical binding", () => {
    runtime.run(`
      let x = 1;
      x = 5;
    `);

    expect(runtime.resolve("x")).toBe(5);
    expect(runtime.lastValue).toBe(5);
  });

  // ───────────────────────────────────────────
  // 2. Assignment updates var binding when lexical not found
  // ───────────────────────────────────────────
  it("updates var binding when lexical missing", () => {
    runtime.run(`
      var x = 10;
      x = 20;
    `);

    expect(runtime.resolve("x")).toBe(20);
    expect(runtime.lastValue).toBe(20);
  });

  // ───────────────────────────────────────────
  // 3. Assignment inside block mutates nearest lexical binding
  // ───────────────────────────────────────────
  it("mutates lexical shadowed binding inside block", () => {
    runtime.run(`
      let x = 1;

      {
        let x = 2;
        x = 99;
      }
    `);

    // outer should remain unchanged
    expect(runtime.resolve("x")).toBe(1);
    // lastValue from x = 99
    expect(runtime.lastValue).toBe(99);
  });

  // ───────────────────────────────────────────
  // 4. Assignment inside block falls back to var env if no lexical shadow
  // ───────────────────────────────────────────
  it("falls back to var environment if no lexical match", () => {
    runtime.run(`
      var x = 5;

      {
        x = 42;
      }
    `);

    expect(runtime.resolve("x")).toBe(42);
    expect(runtime.lastValue).toBe(42);
  });

  // ───────────────────────────────────────────
  // 5. Throws if assignment target does not exist
  // ───────────────────────────────────────────
  it("throws if assigning to a non-existent identifier", () => {
    expect(() => {
      runtime.run(`
        y = 10;
      `);
    }).toThrow();
  });
});
