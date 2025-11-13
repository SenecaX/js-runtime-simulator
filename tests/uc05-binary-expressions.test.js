import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC05: Binary Expressions
//

describe("UC05 - Binary Expressions", () => {
  let runtime;

  beforeEach(() => {
    runtime = new RuntimeEngine();
    runtime.init();
  });

  afterEach(() => {
    runtime.terminate();
  });

  // ─────────────────────────────────────────
  // 1. Literal + Literal
  // ─────────────────────────────────────────
  it("evaluates simple binary expressions", () => {
    runtime.run(`
      1 + 2;
    `);

    // We need a way to fetch the last evaluated expression result.
    // Until UC05 patch adds ExpressionStatement result propagation,
    // we test through direct evaluator call:
    const result = runtime.controlFlow.evaluator.evaluate({
      type: "BinaryExpression",
      operator: "+",
      left: { type: "Literal", value: 1 },
      right: { type: "Literal", value: 2 }
    });

    expect(result).toBe(3);
  });

  // ─────────────────────────────────────────
  // 2. Identifier + Literal
  // ─────────────────────────────────────────
  it("evaluates binary expressions with identifiers", () => {
    runtime.run(`
      let x = 5;
    `);

    const result = runtime.controlFlow.evaluator.evaluate({
      type: "BinaryExpression",
      operator: "+",
      left: { type: "Identifier", name: "x" },
      right: { type: "Literal", value: 3 }
    });

    expect(result).toBe(8);
  });

  // ─────────────────────────────────────────
  // 3. Nested expressions
  // ─────────────────────────────────────────
  it("evaluates nested binary expressions", () => {
    runtime.run(`
      let x = 2;
      let y = 3;
    `);

    const result = runtime.controlFlow.evaluator.evaluate({
      type: "BinaryExpression",
      operator: "+",
      left: {
        type: "BinaryExpression",
        operator: "*",
        left: { type: "Identifier", name: "x" },
        right: { type: "Identifier", name: "y" }
      },
      right: { type: "Literal", value: 1 }
    });

    // x * y + 1 = 2 * 3 + 1 = 7
    expect(result).toBe(7);
  });
});
