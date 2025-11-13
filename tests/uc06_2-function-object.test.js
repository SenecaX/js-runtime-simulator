import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

describe("UC06.2 — FunctionObject Representation", () => {

  it("creates a FunctionObject for a FunctionDeclaration", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    // Fake AST for: function foo(a, b) { return a + b; }
    const fnAst = {
      type: "FunctionDeclaration",
      id: { name: "foo" },
      params: [
        { type: "Identifier", name: "a" },
        { type: "Identifier", name: "b" }
      ],
      body: {
        type: "BlockStatement",
        body: [
          {
            type: "ReturnStatement",
            argument: {
              type: "BinaryExpression",
              operator: "+",
              left: { type: "Identifier", name: "a" },
              right: { type: "Identifier", name: "b" }
            }
          }
        ]
      }
    };

    const result = runtime.controlFlow.dispatch(fnAst);

    expect(result).toBeDefined();
    expect(result.type).toBe("FunctionObject");
    expect(result.name).toBe("foo");

    // params extracted
    expect(result.params).toEqual(["a", "b"]);

    // body captured
    expect(result.body.type).toBe("BlockStatement");

    // closure is current lexical environment at declaration time
    const envs = runtime.getCurrentEnvs();
    expect(result.closure).toBe(envs.lexical);

    // ensure function binding is in lexical env
    expect(envs.lexical.environmentRecord.foo).toBe(result);
  });

});
