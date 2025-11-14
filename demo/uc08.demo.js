import { RuntimeEngine } from "../engine/runtime-engine.js";

console.log("\n=== UC08 Demo: FunctionExpression ===\n");

const runtime = new RuntimeEngine();
runtime.init();

//
// 1. function expression returns a FunctionObject
//
runtime.run(`
  let f = function (a, b) { return a + b; };
  f(2, 3);
`);

console.log("FunctionExpression f(2,3) =", runtime.lastValue); // 5



//
// 2. IIFE (Immediately Invoked Function Expression)
//
runtime.run(`
  (function (x) { return x * 2; })(7);
`);

console.log("IIFE result =", runtime.lastValue); // 14



//
// 3. closure capture
//
runtime.run(`
  let x = 10;
  let g = function () { return x; };
  g();
`);

console.log("Closure capture g() =", runtime.lastValue); // 10



//
// 4. named function expression
//
runtime.run(`
  let h = function id(z) { return z + 1; };
  h(4);
`);

console.log("Named FunctionExpression h(4) =", runtime.lastValue); // 5


runtime.terminate();
