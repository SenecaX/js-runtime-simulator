import { describe, test, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

describe("UC12 – Global let/const Declaration Instantiation + TDZ Setup", () => {

  test("let initializes correctly", () => {
    const r = new RuntimeEngine();
    r.run("let x = 2;");
    expect(r.resolve("x")).toBe(2);
  });

  test("const initializes correctly", () => {
    const r = new RuntimeEngine();
    r.run("const x = 3;");
    expect(r.resolve("x")).toBe(3);
  });

  test("let TDZ access throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("x; let x = 10;"))
      .toThrow("x is not initialized");
  });

  test("const TDZ access throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("x; const x = 10;"))
      .toThrow("x is not initialized");
  });

  test("const without initializer throws", () => {
    const r = new RuntimeEngine();
    expect(() => r.run("const x;"))
      .toThrow();
  });

  test("block shadowing creates isolated lexical environments", () => {
    const r = new RuntimeEngine();
    r.run(`
      let x = 1;
      {
        let x = 2;
      }
    `);
    expect(r.resolve("x")).toBe(1);
  });

});
