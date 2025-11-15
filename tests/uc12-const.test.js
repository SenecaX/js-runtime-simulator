import { describe, test, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

describe("UC12 – const (ES-compliant)", () => {

  test("const initializes correctly", () => {
    const r = new RuntimeEngine();
    r.run("const x = 1;");
    expect(r.resolve("x")).toBe(1);
  });

  test("TDZ: read before initialization throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("x; const x = 10;"))
      .toThrow("Cannot access 'x' before initialization");
  });

  test("TDZ: write before initialization throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("x = 5; const x = 10;"))
      .toThrow("Cannot access 'x' before initialization");
  });

  test("const without initializer throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("const x;")).toThrow();
  });

  test("const reassignment throws TypeError", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("const x = 1; x = 2;")).toThrow();
  });

  test("block shadowing works", () => {
    const r = new RuntimeEngine();
    r.run(`
      const x = 1;
      { const x = 2; }
    `);
    expect(r.resolve("x")).toBe(1);
  });

  test("block-scoped const does not leak", () => {
    const r = new RuntimeEngine();
    r.run("{ const y = 10; }");
    expect(() => r.resolve("y")).toThrow("y is not defined");
  });

  test("redeclaration in same scope throws (const-const)", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("const x = 1; const x = 2;"))
      .toThrow();
  });

  test("redeclaration const-let throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("const x = 1; let x = 2;"))
      .toThrow();
  });

  test("var-const conflict throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("var x = 1; const x = 2;"))
      .toThrow();
  });

});
