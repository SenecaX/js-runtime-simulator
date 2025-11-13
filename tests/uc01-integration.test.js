import { RuntimeEngine } from "../engine/runtime-engine.js";
import { test, expect } from "vitest";

test("UC01 Integration: let x = 2", () => {
  const runtime = new RuntimeEngine();

  runtime.init();
  runtime.run("let x = 2;");
  expect(runtime.resolve("x")).toBe(2);
  runtime.terminate();
});


test("UC02: var x = 2 is stored in VariableEnv", () => {
  const runtime = new RuntimeEngine();

  runtime.init();
  runtime.run("var x = 2;");
  expect(runtime.resolve("x")).toBe(2);

  const envs = runtime.getCurrentEnvs();
  expect(envs.variable.environmentRecord).toEqual({ x: 2 });
  expect(envs.lexical.environmentRecord).toEqual({});
  
  runtime.terminate();
});

test("UC03: const x = 2 is stored in LexicalEnv", () => {
  const runtime = new RuntimeEngine();

  runtime.init();
  runtime.run("const x = 2;");

  // resolution works
  expect(runtime.resolve("x")).toBe(2);

  // environment correctness
  const envs = runtime.getCurrentEnvs();
  expect(envs.lexical.environmentRecord).toEqual({ x: 2 });
  expect(envs.variable.environmentRecord).toEqual({});

  runtime.terminate();
});