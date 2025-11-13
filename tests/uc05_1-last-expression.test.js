import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC05.1 — Last Expression Result
//

describe("UC05.1 - Last Expression Result", () => {
  let runtime;

  beforeEach(() => {
    runtime = new RuntimeEngine();
    runtime.init();
  });

  afterEach(() => {
    runtime.terminate();
  });

  // ───────────────────────────────────────────
  // 1. Literal Expression
  // ───────────────────────────────────────────
  it("captures last literal expression", () => {
    runtime.run(`
      5;
    `);

    expect(runtime.lastValue).toBe(5);
  });

  // ───────────────────────────────────────────
  // 2. Identifier Expression
  // ───────────────────────────────────────────
  it("captures last identifier expression", () => {
    runtime.run(`
      let x = 7;
      x;
    `);

    expect(runtime.lastValue).toBe(7);
  });

  // ───────────────────────────────────────────
  // 3. Binary Expression
  // ───────────────────────────────────────────
  it("captures last binary expression", () => {
    runtime.run(`
      let a = 2;
      let b = 3;
      a + b;
    `);

    expect(runtime.lastValue).toBe(5);
  });

  // ───────────────────────────────────────────
  // 4. Nested Binary Expression
  // ───────────────────────────────────────────
  it("captures nested binary expression", () => {
    runtime.run(`
      let x = 2;
      let y = 3;
      x * y + 1;
    `);

    // 2 * 3 + 1 = 7
    expect(runtime.lastValue).toBe(7);
  });
});
