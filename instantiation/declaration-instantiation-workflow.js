// instantiation/declaration-instantiation-workflow.js
import { UNINITIALIZED } from "../runtime-time/variable-resolution-workflow.js";
import { FunctionObject } from "../runtime-time/function-object.js";
import { LexicalEnvironment } from "../runtime-space/lexical-environment.js";
import { VariableEnvironment } from "../runtime-space/variable-environment.js";

export class DeclarationInstantiationWorkflow {
  constructor(runtime) {
    this.runtime = runtime;
  }

  /**
   * Full UC12 — Global Declaration Instantiation
   * MUST:
   * 1. Create fresh global lexical + variable environments
   * 2. Populate them with all hoisted bindings
   * 3. Return them so RuntimeEngine can install the Global Execution Context
   */
  instantiateGlobal(ast) {
    // 1 — fresh global environments (CRITICAL FIX)
    const globalLex = new LexicalEnvironment(null);
    const globalVar = new VariableEnvironment(null);

    // Install them into the runtime (so ControlFlow + resolve use them)
    this.runtime.variables.globalLexical = globalLex;
    this.runtime.variables.globalVariable = globalVar;

    // 2 — collect declarations
    const fns = [];
    const vars = [];
    const lets = [];
    const consts = [];

    this._scanRoot(ast.body, fns, vars, lets, consts);

    // 3 — hoist functions (initialized)
    for (const node of fns) {
      const name = node.id.name;
      const params = node.params.map(p => p.name);
      const closure = globalLex;

      const fn = new FunctionObject(name, params, node.body, closure);
      globalLex.define(name, fn);
    }

    // 4 — hoist var (undefined → var env)
    for (const name of vars) {
      globalVar.define(name, undefined);
    }

    // 5 — prepare let (UNINITIALIZED → lexical env)
    for (const name of lets) {
      globalLex.define(name, UNINITIALIZED);
    }

    // 6 — prepare const (UNINITIALIZED → lexical env)
    for (const name of consts) {
      globalLex.define(name, UNINITIALIZED);
    }

    // 7 — return for RuntimeEngine.run()
    return { globalLex, globalVar };
  }

  _scanRoot(body, fns, vars, lets, consts) {
    for (const node of body) {
      switch (node.type) {
        case "FunctionDeclaration":
          fns.push(node);
          break;

        case "VariableDeclaration":
          this._collectVarDecl(node, vars, lets, consts);
          break;

        case "BlockStatement":
          this._scanRoot(node.body, fns, vars, lets, consts);
          break;
      }
    }
  }

  _collectVarDecl(node, vars, lets, consts) {
    for (const decl of node.declarations) {
      const name = decl.id.name;

      if (node.kind === "var") vars.push(name);
      if (node.kind === "let") lets.push(name);
      if (node.kind === "const") consts.push(name);
    }
  }
}
