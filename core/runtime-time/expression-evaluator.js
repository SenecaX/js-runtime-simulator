import { FunctionObject } from "./function-object.js";
import { UNINITIALIZED } from "../runtime-time/variable-resolution-workflow.js";

export class ExpressionEvaluator {
  constructor(runtime) {
    this.runtime = runtime;
  }

  evaluate(expr) {
    if (!expr) return undefined;

    switch (expr.type) {
      case "Literal":
        return expr.value;

      case "Identifier":
          return this.resolveIdentifier(expr.name);


      case "BinaryExpression":
        return this.evalBinary(expr);

      case "AssignmentExpression":
        return this.evalAssignment(expr);

      case "CallExpression":
        return this.evalCall(expr);

      case "FunctionExpression":
        return this.evalFunctionExpression(expr);

      case "ArrowFunctionExpression":
        return this.evalArrowFunction(expr);

      default:
        return undefined;
    }
  }

evalCall(expr) {
  // Try normal resolution first
  let callee = this.evaluate(expr.callee);

  // If unresolved → fallback to var-environment for hoisted functions
  if (!callee && expr.callee.type === "Identifier") {
    const { lexical, variable } = this.runtime.getCurrentEnvs();

    // hoisted function declarations live in lexical env
    if (expr.callee.name in lexical.environmentRecord) {
      callee = lexical.environmentRecord[expr.callee.name];
    }

    // hoisted `var` function expressions (rare, but consistent)
    else if (expr.callee.name in variable.environmentRecord) {
      callee = variable.environmentRecord[expr.callee.name];
    }
  }

  // Validate callee
  if (!callee || callee.type !== "FunctionObject") {
    throw new TypeError("CallExpression: callee is not a function");
  }

  // Validate argument count BEFORE evaluating them
  const expected = callee.params.length;
  const received = expr.arguments.length;

  if (expected !== received) {
    throw new TypeError(
      `CallExpression: expected ${expected} arguments but got ${received}`
    );
  }

  // Evaluate arguments
  const args = expr.arguments.map(arg => this.evaluate(arg));

  // Execute
  return this.runtime.callFunction(callee, args);
}


  evalBinary(expr) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;

      case "==":
        return left == right;
      case "===":
        return left === right;
      case "!=":
        return left != right;
      case "!==":
        return left !== right;

      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;

      default:
        return undefined;
    }
  }

  evalAssignment(expr) {
    const { operator, left, right } = expr;

    if (left.type !== "Identifier") {
      throw new Error("UC06 supports assignment to simple identifiers only");
    }

    const name = left.name;
    const value = this.evaluate(right);

    if (operator === "=") {
      const envs = this.runtime.getCurrentEnvs();
      this.runtime.variables.update(name, value, envs);
      return value;
    }

    throw new Error(`Operator ${operator} not implemented in UC06`);
  }

  evalFunctionExpression(node) {
    const name = node.id ? node.id.name : null;
    const params = node.params.map((p) => p.name);
    const body = node.body;
    const closure = this.runtime.getCurrentEnvs().lexical;

    return new FunctionObject(name, params, body, closure);
  }

  evalArrowFunction(node) {
  const name = null; // arrows have no name
  const params = node.params.map(p => p.name);
  const closure = this.runtime.getCurrentEnvs().lexical;

  // Case A — single-expression arrow:  x => x+1
  if (node.body.type !== "BlockStatement") {
    // wrap expression into: { return expr }
    const returnStmt = {
      type: "ReturnStatement",
      argument: node.body
    };

    const body = {
      type: "BlockStatement",
      body: [returnStmt]
    };

    return new FunctionObject(name, params, body, closure);
  }

  // Case B — block body arrow: x => { ... }
  return new FunctionObject(name, params, node.body, closure);
}

resolveIdentifier(name) {
  const { lexical, variable } = this.runtime.getCurrentEnvs();

// 1. lexical FIRST
if (name in lexical.environmentRecord) {
  const v = lexical.environmentRecord[name];
  if (v === UNINITIALIZED) {
    throw new ReferenceError(`Cannot access '${name}' before initialization`);

  }
  return v;
}

// 2. var SECOND
if (name in variable.environmentRecord) {
  return variable.environmentRecord[name];
}


  // 3. scope-chain fallback (outer envs)
  return this.runtime.resolve(name);
}


}
