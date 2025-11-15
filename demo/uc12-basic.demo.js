import { RuntimeEngine } from "../engine/runtime-engine.js";

function demo(code) {
  const r = new RuntimeEngine();
  r.init();
  r.run(code);
  r.terminate();
}

// ⬇️ PUT ANY TEST SNIPPET HERE
demo(`
const x = 1; x = 2;
`);
