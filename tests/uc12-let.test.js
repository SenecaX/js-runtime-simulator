import { describe, test, expect } from "vitest";
import { RuntimeEngine } from "../core/engine/runtime-engine.js";

describe("UC12 – let (ES-compliant)", () => {

  test("let initializes correctly", () => {
    const r = new RuntimeEngine();
    r.run("let x = 1;");
    expect(r.resolve("x")).toBe(1);
  });

  test("TDZ: read before initialization throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("x; let x = 10;"))
      .toThrow("Cannot access 'x' before initialization");
  });

  test("TDZ: write before initialization throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("x = 5; let x = 10;"))
      .toThrow("Cannot access 'x' before initialization");
  });

  test("block TDZ throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("{ x; let x = 1; }"))
      .toThrow("Cannot access 'x' before initialization");
  });

  test("block shadowing works", () => {
    const r = new RuntimeEngine();
    r.run(`
      let x = 1;
      { let x = 2; }
    `);
    expect(r.resolve("x")).toBe(1);
  });

  test("block-scoped let does not leak", () => {
    const r = new RuntimeEngine();
    r.run("{ let y = 10; }");
    expect(() => r.resolve("y")).toThrow("y is not defined");
  });

  test("redeclaration in same scope throws (let-let)", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("let x = 1; let x = 2;"))
      .toThrow();
  });

  test("redeclaration let-const throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("let x = 1; const x = 2;"))
      .toThrow();
  });

  test("redeclaration var-let throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("var x = 1; let x = 2;"))
      .toThrow();
  });

  test("let is not hoisted to undefined (TDZ)", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("x; let x = 10;"))
      .toThrow("Cannot access 'x' before initialization");
  });

});
