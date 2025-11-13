import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

console.log("\n=== UC06.3 Demo: Function Execution Context ===\n");

runtime.run(`

  // Global lexical
  let x = 10;

  function add(a, b) {
    return a + b;
  }

  function inc(n) {
    return n + x;   // uses closure x = 10
  }

  add(2, 3);   // lastValue should be 5
  inc(5);      // lastValue should be 15

`);

console.log("lastValue =", runtime.lastValue);     // 15
console.log("resolve add =", runtime.resolve("add"));
console.log("resolve inc =", runtime.resolve("inc"));
console.log("resolve x =", runtime.resolve("x"));

runtime.terminate();
