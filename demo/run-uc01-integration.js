import { RuntimeEngine } from "../runtime/runtime-engine.js";

const runtime = new RuntimeEngine();

runtime.init();
runtime.run("let x = 2;");
console.log("x =", runtime.resolve("x"));

runtime.terminate();

