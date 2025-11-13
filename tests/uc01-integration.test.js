import { RuntimeEngine } from "../../5-runtime/runtime-engine.js";

test("UC01 Integration: let x = 2", () => {
  const runtime = new RuntimeEngine();

  runtime.init();
  runtime.run("let x = 2;");
  runtime.terminate();

  expect(runtime.resolve("x")).toBe(2);
});
