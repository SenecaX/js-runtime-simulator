import { UNINITIALIZED } from "../time/variable-resolution.js";
import { FunctionObject } from "../time/function-object.js";
import { LexicalEnvironment } from "../space/lexical-environment.js";
import { VariableEnvironment } from "../space/variable-environment.js";

export class InstantiationWorkflow {
  constructor(runtime) {
    this.runtime = runtime;
  }

  // ========================================================
  // GLOBAL DECLARATION INSTANTIATION  (UC12 + UC13 COMPLIANT)
  // ========================================================
  instantiateGlobal(ast) {
    const globalLex = new LexicalEnvironment(null);
    const globalVar = new VariableEnvironment(null);

    // expose to runtime
    this.runtime.variables.globalLexical = globalLex;
    this.runtime.variables.globalVariable = globalVar;

    // Collect declarations
    const fns = [];
    const vars = [];
    const lets = [];
    const consts = [];

    // ========================================================
    // TOP-LEVEL SCAN (ONLY top level can declare global let/const)
    // ========================================================
    for (const node of ast.body) {
      if (node.type === "FunctionDeclaration") {
        fns.push(node);
        continue;
      }

      if (node.type === "VariableDeclaration") {
        for (const decl of node.declarations) {
          const name = decl.id.name;

          if (node.kind === "var") vars.push(name);
          if (node.kind === "let") lets.push(name);
          if (node.kind === "const") consts.push(name);
        }
      }
    }

    // ========================================================
    // RECURSIVE WALK FOR var + function only (UC13)
    // (let/const inside blocks/functions are NOT global)
    // ========================================================
    function collect(node) {
      if (!node || typeof node !== "object") return;

      if (node.type === "VariableDeclaration") {
        for (const decl of node.declarations) {
          const name = decl.id.name;
          if (node.kind === "var") vars.push(name);  // var only
        }
      }

      if (node.type === "FunctionDeclaration") {
        fns.push(node);
      }

      for (const key in node) {
        const value = node[key];
        if (Array.isArray(value)) value.forEach(collect);
        else if (value && typeof value === "object") collect(value);
      }
    }

    collect(ast);

    // ========================================================
    // HOIST FUNCTION DECLARATIONS (global lexical)
    // ========================================================
    for (const node of fns) {
      const name = node.id.name;
      const params = node.params.map(p => p.name);
      const fn = new FunctionObject(name, params, node.body, globalLex);
      globalLex.define(name, fn);
    }

    // ========================================================
    // HOIST VAR DECLARATIONS (global variable env)
    // ========================================================
    for (const name of vars) {
      globalVar.define(name, undefined);
    }

    // ========================================================
    // HOIST TOP-LEVEL LET/CONST (TDZ)
    // ========================================================
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
    // 1. bind params to lexical environment
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
