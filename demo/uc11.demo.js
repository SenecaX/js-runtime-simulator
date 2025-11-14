import { RuntimeEngine } from "../engine/runtime-engine.js";

//
// UC11 — ArrowFunctionExpression Demo
//

const runtime = new RuntimeEngine();
runtime.init();

// ───────────────────────────────────────────
// 1. Single-param, single-expression arrow
// ───────────────────────────────────────────
console.log("\n=== Arrow: x => x + 1 ===");
runtime.run(`
  const inc = x => x + 1;
  inc(5);
`);
console.log("lastValue =", runtime.lastValue);

// ───────────────────────────────────────────
// 2. Multi-param, single expression
// ───────────────────────────────────────────
console.log("\n=== Arrow: (a,b) => a + b ===");
runtime.run(`
  const add = (a, b) => a + b;
  add(2, 3);
`);
console.log("lastValue =", runtime.lastValue);

// ───────────────────────────────────────────
// 3. Block-body arrow
// ───────────────────────────────────────────
console.log("\n=== Arrow: x => { const y=x*2; return y+1; } ===");
runtime.run(`
  const f = x => { const y = x * 2; return y + 1; };
  f(10);
`);
console.log("lastValue =", runtime.lastValue);

// ───────────────────────────────────────────
// 4. Inline arrow call
// ───────────────────────────────────────────
console.log("\n=== Inline arrow: (x => x*3)(4) ===");
runtime.run(`
  (x => x * 3)(4);
`);
console.log("lastValue =", runtime.lastValue);

// ───────────────────────────────────────────
// 5. Arrow passed as argument
// ───────────────────────────────────────────
console.log("\n=== Arrow passed as arg ===");
runtime.run(`
  const apply = (fn, v) => fn(v);
  apply(x => x + 10, 7);
`);
console.log("lastValue =", runtime.lastValue);

runtime.terminate();
