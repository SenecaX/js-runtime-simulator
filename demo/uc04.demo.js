import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

runtime.run(`
  var x = 1;

  {
    let x = 2;
    x;      // should resolve to 2
  }

  x;        // should resolve to 1
`);

// Manual checks
console.log("resolve x (global) =", runtime.resolve("x"));

runtime.terminate();
