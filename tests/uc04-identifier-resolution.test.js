import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC04: Identifier Resolution
//

describe("UC04 - Identifier Resolution", () => {
  let runtime;

  beforeEach(() => {
    runtime = new RuntimeEngine();
    runtime.init();
  });

  afterEach(() => {
    runtime.terminate();
  });

  // 1. global resolution (works now)
  it("resolves identifiers in global env", () => {
    runtime.run(`
      var x = 1;
    `);

    const value = runtime.resolve("x");
    expect(value).toBe(1);
  });

  // 2. lexical shadowing (will pass after block scope patch)
  it("resolves identifiers with lexical shadowing", () => {
    runtime.run(`
      var x = 1;
      {
        let x = 2;
      }
    `);

    const value = runtime.resolve("x");
    expect(value).toBe(1);
  });
});
