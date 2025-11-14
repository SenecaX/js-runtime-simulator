import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

// helpers
function run(code) {
  const rt = new RuntimeEngine();
  rt.init();
  const out = rt.run(code);
  rt.terminate();
  return out;
}

describe("UC12 — Hoisting, TDZ, Global Instantiation", () => {

  // ───────────────────────────────────────────────
  // var — hoisted, initialized to undefined
  // ───────────────────────────────────────────────
  it("var should be accessible before declaration (undefined)", () => {
    const rt = new RuntimeEngine();
    rt.init();

    expect(() => rt.run("x; var x = 10;")).not.toThrow();
    expect(rt.resolve("x")).toBe(10);

    rt.terminate();
  });

  // ───────────────────────────────────────────────
  // let — TDZ
  // ───────────────────────────────────────────────
  it("let should throw ReferenceError when accessed before initialization", () => {
    const rt = new RuntimeEngine();
    rt.init();

    expect(() => rt.run("y; let y = 10;")).toThrow(ReferenceError);

    rt.terminate();
  });

  it("const should throw ReferenceError when accessed before initialization", () => {
    const rt = new RuntimeEngine();
    rt.init();

    expect(() => rt.run("z; const z = 10;")).toThrow(ReferenceError);

    rt.terminate();
  });

  // ───────────────────────────────────────────────
  // Function declarations — fully hoisted, callable early
  // ───────────────────────────────────────────────
  it("function declarations should be callable before their definition", () => {
    const rt = new RuntimeEngine();
    rt.init();

    const out = rt.run(`
      foo();
      function foo() { return 42; }
    `);

    rt.terminate();

    expect(out).toBe(42);
  });

  // ───────────────────────────────────────────────
  // Block scoping + TDZ
  // ───────────────────────────────────────────────
  it("block-scoped let should be TDZ inside block", () => {
    const rt = new RuntimeEngine();
    rt.init();

    expect(() =>
      rt.run(`
        {
          a;
          let a = 7;
        }
      `)
    ).toThrow(ReferenceError);

    rt.terminate();
  });

  // ───────────────────────────────────────────────
  // var inside block hoists to global variable env
  // ───────────────────────────────────────────────
  it("var inside block hoists to global variable env", () => {
    const rt = new RuntimeEngine();
    rt.init();

    rt.run(`
      {
        var v = 123;
      }
    `);

    expect(rt.resolve("v")).toBe(123);

    rt.terminate();
  });

  // ───────────────────────────────────────────────
  // Access let AFTER declaration is fine
  // ───────────────────────────────────────────────
  it("let assignment after TDZ is allowed when accessed after initialization", () => {
    const rt = new RuntimeEngine();
    rt.init();

    expect(() =>
      rt.run(`
        let k = 0;
        k = 7;
      `)
    ).not.toThrow();

    expect(rt.resolve("k")).toBe(7);

    rt.terminate();
  });
});
