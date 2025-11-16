import { UNINITIALIZED } from "../time/variable-resolution.js";
import { FunctionObject } from "../time/function-object.js";
import { LexicalEnvironment } from "../space/lexical-environment.js";
import { VariableEnvironment } from "../space/variable-environment.js";

export class InstantiationWorkflow {
  constructor(runtime) {
    this.runtime = runtime;
  }

  // ========================================================
  // GLOBAL DECLARATION INSTANTIATION
  // ========================================================
instantiateGlobal(ast) {
  const globalLex = new LexicalEnvironment(null);
  const globalVar = new VariableEnvironment(null);

  // expose to runtime
  this.runtime.variables.globalLexical = globalLex;
  this.runtime.variables.globalVariable = globalVar;

  // collect
  const fns = [];
  const vars = [];
  const lets = [];
  const consts = [];

  function collect(node) {
    if (!node || typeof node !== "object") return;

    // var / let / const
    if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        const name = decl.id.name;
        if (node.kind === "var") vars.push(name);
        if (node.kind === "let") lets.push(name);
        if (node.kind === "const") consts.push(name);
      }
    }

    // function declarations
    if (node.type === "FunctionDeclaration") {
      fns.push(node);
    }

    // recurse into child nodes
    for (const key in node) {
      const value = node[key];
      if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") collect(value);
    }
  }

  // start recursive walk
  collect(ast);

  // function hoisting
  for (const node of fns) {
    const name = node.id.name;
    const params = node.params.map(p => p.name);
    const fn = new FunctionObject(name, params, node.body, globalLex);
    globalLex.define(name, fn);
  }

  // var hoisting
  for (const name of vars) {
    globalVar.define(name, undefined);
  }

  // let/const → UNINITIALIZED
  for (const name of lets) {
    globalLex.define(name, UNINITIALIZED);
  }

  for (const name of consts) {
    globalLex.define(name, UNINITIALIZED);
  }

  return { globalLex, globalVar };
}

  // ========================================================
  // FUNCTION DECLARATION INSTANTIATION
  // ========================================================
  instantiateFunction(fnNode, lexicalEnv, varEnv, args) {
    // 1. bind params
    fnNode.params.forEach((param, index) => {
      lexicalEnv.define(param.name, args[index]);
    });

    // 2. hoist declarations inside function body
    for (const stmt of fnNode.body.body) {
      // function declarations
      if (stmt.type === "FunctionDeclaration") {
        const name = stmt.id.name;
        const params = stmt.params.map(p => p.name);
        const fn = new FunctionObject(name, params, stmt.body, lexicalEnv);
        lexicalEnv.define(name, fn);
        continue;
      }

      // variable declarations
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
            continue;
          }
        }
      }
    }
  }

  // ========================================================
  // BLOCK DECLARATION INSTANTIATION
  // ========================================================
  instantiateBlock(blockNode, blockLexEnv) {
    for (const stmt of blockNode.body) {
      // block-scoped functions
      if (stmt.type === "FunctionDeclaration") {
        const name = stmt.id.name;
        const params = stmt.params.map(p => p.name);
        const fn = new FunctionObject(name, params, stmt.body, blockLexEnv);
        blockLexEnv.define(name, fn);
        continue;
      }

      // block-scoped let/const
      if (stmt.type === "VariableDeclaration") {
        if (stmt.kind === "let" || stmt.kind === "const") {
          for (const decl of stmt.declarations) {
            blockLexEnv.define(decl.id.name, UNINITIALIZED);
          }
        }
      }
    }
  }
}
