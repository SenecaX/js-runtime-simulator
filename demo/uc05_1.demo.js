import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

runtime.run(`
  let a = 2;
  let b = 3;

  // literal expression
  5;

  // identifier expression
  a;

  // binary expression
  a + b;

  // nested binary expression
  a * b + 1;

  {
    let a = 10;
    a + b;     // expected: 13 (shadowed a)
  }

  a + b;       // expected: 5 (outer a restored)
`);

// manual check: last evaluated expression
console.log("lastValue =", runtime.lastValue);

runtime.terminate();
