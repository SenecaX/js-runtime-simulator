import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();

runtime.init();
runtime.run("var x = 2; let y = 3; const z = 6;");
console.log("x =", runtime.resolve("x"));
console.log("x =", runtime.resolve("y"));

runtime.terminate();

