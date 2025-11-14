import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC10 — lastValue propagation test
//

function runCase(label, code) {
  console.log("\n=== " + label + " ===");
  const runtime = new RuntimeEngine();
  runtime.init();

  runtime.run(code);

  console.log("lastValue =", runtime.lastValue);
  runtime.terminate();
}

// ─────────────────────────────────────────────
// TEST CASES
// ─────────────────────────────────────────────

// 1. Literal — should only work if ExpressionStatement updates it
runCase("Literal", `
  5;
`);

// 2. Identifier lookup
runCase("Identifier lookup", `
  let x = 10;
  x;
`);

// 3. Binary expression
runCase("Binary expression", `
  1 + 2;
`);

// 4. Function return — should only update if g() is an ExpressionStatement
runCase("Function call return", `
  function f() { return 99; }
  f();
`);

// 5. Nested call chain
runCase("Nested calls", `
  function add(a, b) { return a + b; }
  function mul(x) { return x * 3; }
  mul(add(2, 3));
`);

// 6. Return inside function but NOT followed by ExpressionStatement
runCase("Return inside function (no top expr)", `
  function f() { return 77; }
  // no expression at top: lastValue should be undefined
`);
