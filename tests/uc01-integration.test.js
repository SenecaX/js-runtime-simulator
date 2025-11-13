import { RuntimeEngine } from "../engine/runtime-engine.js";
import { test, expect } from "vitest";

test("UC01 Integration: let x = 2", () => {
  const runtime = new RuntimeEngine();

  runtime.init();
  runtime.run("let x = 2;");
  expect(runtime.resolve("x")).toBe(2);
  runtime.terminate();
});
