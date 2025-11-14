// /instantiation/block-instantiator.js
import { UNINITIALIZED } from "../runtime-time/variable-resolution-workflow.js";

export class BlockInstantiator {
  constructor(runtime) {
    this.runtime = runtime;
  }

  run(blockNode, blockLexEnv) {
    for (const stmt of blockNode.body) {
      if (stmt.type === "VariableDeclaration") {
        if (stmt.kind === "let" || stmt.kind === "const") {
          for (const decl of stmt.declarations) {
            const name = decl.id.name;
            blockLexEnv.define(name, UNINITIALIZED);
          }
        }
      }

      if (stmt.type === "FunctionDeclaration") {
        // Spec requires block-scoped functions
        const name = stmt.id.name;
        const params = stmt.params.map(p => p.name);
        const fn = new this.runtime.FunctionObject(name, params, stmt.body, blockLexEnv);
        blockLexEnv.define(name, fn);
      }
    }
  }
}
