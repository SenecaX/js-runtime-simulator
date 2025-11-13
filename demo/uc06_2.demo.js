import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

console.log("\n=== UC06.2 Demo: FunctionObject Representation ===");

// This code only declares a function.
// It does NOT call it (CallExpression is UC06.3).
runtime.run(`
  let x = 10;

  function add(a, b) {
    return a + b + x;  // x is captured in closure
  }
`);

// The function should be bound in the global lexical env
console.log("\nresolve add =", runtime.resolve("add"));

// The captured closure should contain x = 10
const fn = runtime.resolve("add");
console.log("captured closure x =", fn.closure.lookup("x"));

runtime.terminate();
