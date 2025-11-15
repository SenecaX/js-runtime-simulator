import { RuntimeEngine } from "../engine/runtime-engine.js";

function demo(code) {
  const r = new RuntimeEngine();
  r.init();
  r.run(code);

  // 👇 the ONLY extra line you need
  // console.log("x =", r.resolve("x"));

  r.terminate();
}

// ⬇️ PUT ANY TEST SNIPPET HERE
demo(`
const x = 1; x = 2;
`);
