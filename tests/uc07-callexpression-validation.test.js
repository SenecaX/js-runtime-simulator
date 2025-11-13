import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

describe("UC07 — CallExpression Validation", () => {

  it("throws TypeError when calling a number", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    expect(() => runtime.run("42();"))
      .toThrowError(TypeError);

    runtime.terminate();
  });

  it("throws TypeError when calling a non-function variable", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    expect(() => runtime.run("let x = 10; x();"))
      .toThrowError(TypeError);

    runtime.terminate();
  });

  it("throws TypeError when calling undefined", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    expect(() => runtime.run("x();"))   // x not defined
      .toThrowError(TypeError);

    runtime.terminate();
  });

  it("throws TypeError when calling null", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    expect(() => runtime.run("let n = null; n();"))
      .toThrowError(TypeError);

    runtime.terminate();
  });

  it("allows calling real FunctionObject", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    const result = runtime.run(`
      function add(a,b) { return a + b; }
      add(2,3);
    `);

    expect(runtime.lastValue).toBe(5);

    runtime.terminate();
  });

});
