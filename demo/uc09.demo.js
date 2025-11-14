import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC09 — Nested Call Chains Demo
//

const runtime = new RuntimeEngine();
runtime.init();

runtime.run(`
  function f(x) { 
    return x + 1; 
  }

  function g(y) { 
    return f(y) * 2; 
  }

  g(5);
`);

console.log("Final lastValue =", runtime.lastValue);

// cleanup
runtime.terminate();
