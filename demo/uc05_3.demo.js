import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

runtime.run(`

  // Global lexical + variable
  let a = 1;
  var b = 10;

  {
    // Block 1
    let a = 2;

    {
      // Block 2
      let a = 3;
      let c = 30;
    }

    b = 99;  // updates var binding
  }

  a;   // final lastValue = 1
`);

console.log("resolve a =", runtime.resolve("a")); // 1
console.log("resolve b =", runtime.resolve("b")); // 99

runtime.terminate();
