import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

runtime.run(`

  // global lexical binding
  let x = 1;

  // simple assignment
  x = 5;          // expected: x becomes 5, lastValue = 5

  // var binding fallback
  var y = 10;
  y = 20;         // expected: y becomes 20, lastValue = 20

  {
    // lexical shadow inside block
    let x = 2;
    x = 99;       // expected: inner x becomes 99, outer x stays 5
  }

  // after block, outer x is still 5
  x;              // expected: lastValue = 5

`);

console.log("resolve x =", runtime.resolve("x")); // expected: 5
console.log("resolve y =", runtime.resolve("y")); // expected: 20
console.log("lastValue =", runtime.lastValue);    // last evaluated expression (x)

runtime.terminate();
