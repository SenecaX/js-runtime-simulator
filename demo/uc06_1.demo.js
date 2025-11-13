/**
 * NOTE: This demo uses a manually constructed AST instead of runtime.run().
 *
 * Reason:
 *   JavaScript does NOT allow `return` at the top level.
 *   Acorn will throw a SyntaxError if we try to parse:
 *
 *       return 5;
 *
 *   A ReturnStatement is only valid inside a function body.
 *
 * Since functions (UC06.2+) are not implemented yet, we directly execute
 * a fake function-body AST to test the ReturnCompletion mechanism:
 *
 *   - return value creation
 *   - early termination of execution
 *   - bubbling through nested blocks
 *
 * This isolates UC06.1 logic without requiring function support.
 */

import { RuntimeEngine } from "../engine/runtime-engine.js";

const runtime = new RuntimeEngine();
runtime.init();

console.log("\n=== UC06.1 Demo: ReturnCompletion ===");

// We manually construct a fake function body (array of statements)
const fakeFunctionBody = [
  { type: "VariableDeclaration", kind: "let", declarations: [
    { id: { name: "a" }, init: { type: "Literal", value: 1 } }
  ]},

  {
    type: "BlockStatement",
    body: [
      { type: "VariableDeclaration", kind: "let", declarations: [
        { id: { name: "a" }, init: { type: "Literal", value: 10 } }
      ]},

      {
        type: "BlockStatement",
        body: [
          { type: "VariableDeclaration", kind: "let", declarations: [
            { id: { name: "a" }, init: { type: "Literal", value: 20 } }
          ]},

          // This is the return we want to test
          {
            type: "ReturnStatement",
            argument: {
              type: "BinaryExpression",
              operator: "+",
              left: { type: "Identifier", name: "a" },
              right: { type: "Literal", value: 1 }
            }
          },

          // This must never run
          { type: "ExpressionStatement", expression: { type: "Literal", value: 999 } }
        ]
      }
    ]
  },

  // Also must never run
  { type: "ExpressionStatement", expression: { type: "Literal", value: 888 } }
];

const result = runtime.controlFlow.execute(fakeFunctionBody);

console.log("ReturnCompletion =", result);
console.log("resolve a (global) =", runtime.resolve("a"));

runtime.terminate();
