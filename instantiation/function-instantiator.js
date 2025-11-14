// /instantiation/function-instantiator.js
import { UNINITIALIZED } from "../runtime-time/variable-resolution-workflow.js";
import { FunctionObject } from "../runtime-time/function-object.js";

export class FunctionInstantiator {
  constructor(runtime) {
    this.runtime = runtime;
  }

  run(fnNode, lexicalEnv, varEnv, args) {
    // Bind parameters first
    fnNode.params.forEach((param, index) => {
      lexicalEnv.define(param.name, args[index]);
    });

    // Now hoist declarations inside body
    for (const stmt of fnNode.body.body) {

      if (stmt.type === "FunctionDeclaration") {
        const name = stmt.id.name;
        const params = stmt.params.map(p => p.name);
        const body = stmt.body;
        const fn = new FunctionObject(name, params, body, lexicalEnv);

        lexicalEnv.define(name, fn);
      }

      if (stmt.type === "VariableDeclaration") {
        const kind = stmt.kind;

        for (const decl of stmt.declarations) {
          const name = decl.id.name;

          if (kind === "var") {
            varEnv.define(name, undefined);
            continue;
          }

          if (kind === "let" || kind === "const") {
            lexicalEnv.define(name, UNINITIALIZED);
          }
        }
      }
    }
  }
}
