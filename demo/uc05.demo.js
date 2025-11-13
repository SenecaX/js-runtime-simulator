import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

runtime.run(`
  let a = 2;
  let b = 3;

  // simple expressions
  a + b;       // expected: 5
  a * b;       // expected: 6
  a + 1;       // expected: 3

  {
    let a = 10;
    a + b;     // expected: 13 (block shadowing for a)
  }

  a + b;       // expected: 5 (outer a restored)
`);

// Manual checks
console.log("resolve a =", runtime.resolve("a")); // 2
console.log("resolve b =", runtime.resolve("b")); // 3

runtime.terminate();
