// /instantiation/global-instantiator.js
import { FunctionObject } from "../runtime-time/function-object.js";
import { UNINITIALIZED } from "../runtime-time/variable-resolution-workflow.js";

export class GlobalInstantiator {
  constructor(runtime) {
    this.runtime = runtime;
  }

  run(ast) {
    const globalLex = this.runtime.variables.globalLexical;
    const globalVar = this.runtime.variables.globalVariable;

    for (const node of ast.body) {
      if (node.type === "FunctionDeclaration") {
        this.instantiateFunction(globalLex, node);
      }

      if (node.type === "VariableDeclaration") {
        this.instantiateVariable(globalLex, globalVar, node);
      }
    }
  }

  instantiateFunction(globalLex, node) {
    const name = node.id.name;
    const params = node.params.map(p => p.name);
    const body = node.body;
    const fn = new FunctionObject(name, params, body, globalLex);

    globalLex.define(name, fn);
  }

  instantiateVariable(globalLex, globalVar, node) {
    const kind = node.kind;

    for (const decl of node.declarations) {
      const name = decl.id.name;

      if (kind === "var") {
        globalVar.define(name, undefined);
        continue;
      }

      if (kind === "let" || kind === "const") {
        globalLex.define(name, UNINITIALIZED);
        continue;
      }
    }
  }
}
