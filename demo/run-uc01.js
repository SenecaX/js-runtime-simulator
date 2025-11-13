import { RuntimeEngine } from "../runtime/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.run("let x = 2;");
console.log(runtime.resolve("x")); // → 2
