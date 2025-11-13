import { RuntimeEngine } from "../runtime/runtime-engine.js";

test("UC01: let x = 2", () => {
  const runtime = new RuntimeEngine();
  runtime.run("let x = 2;");
  expect(runtime.resolve("x")).toBe(2);
});
