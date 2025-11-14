import { RuntimeEngine } from "../engine/runtime-engine.js";

console.log("\n=== UC07 Demo: CallExpression Validation ===\n");

const runtime = new RuntimeEngine();
runtime.init();

//
// 1. VALID FUNCTION CALL
//
runtime.init();    // reset global
runtime.run(`
  function add(a, b) { return a + b; }
  add(2, 3);
`);
console.log("valid call result =", runtime.lastValue);

//
// 2. INVALID — callee is NOT a function
//
runtime.init();    // reset global
try {
  runtime.run(`
    let x = 10;
    x(5);
  `);
} catch (err) {
  console.log("non-function call ERROR =", err.message);
}

//
// 3. INVALID — argument count mismatch
//
runtime.init();    // reset global
try {
  runtime.run(`
    function f(a, b) { return a + b; }
    f(1);
  `);
} catch (err) {
  console.log("argument mismatch ERROR =", err.message);
}

runtime.terminate();



runtime.terminate();
