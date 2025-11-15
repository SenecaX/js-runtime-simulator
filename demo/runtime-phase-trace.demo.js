import { RuntimeEngine } from "../engine/runtime-engine.js";

console.log("=== RUNTIME PHASE TRACE ===");

const runtime = new RuntimeEngine();

// Change this to any snippet you want to trace
const code = `
let x = 2;
`;

console.log("CODE:");
console.log(code);
console.log("----------------------------------------\n");

runtime.run(code);

// If you want to inspect final variable states:
try {
  console.log("RESOLVE x =", runtime.resolve("x"));
} catch {
  console.log("RESOLVE x threw (TDZ or not defined)");
}

console.log("\n=== END TRACE ===");
