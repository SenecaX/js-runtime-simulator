import { describe, it, expect } from "vitest";
import { RuntimeEngine } from "../engine/runtime-engine.js";

describe("UC06.1 — ReturnCompletion (ReturnStatement Support)", () => {
  it("returns a value and stops execution of remaining statements", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    const result = runtime.controlFlow.dispatch({
      type: "ReturnStatement",
      argument: { type: "Literal", value: 42 }
    });

    expect(result).toEqual({ type: "return", value: 42 });
  });

  it("returns undefined when no argument is provided", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    const result = runtime.controlFlow.dispatch({
      type: "ReturnStatement",
      argument: null
    });

    expect(result).toEqual({ type: "return", value: undefined });
  });

  it("bubbles through a BlockStatement", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    const ast = {
      type: "BlockStatement",
      body: [
        { type: "ReturnStatement", argument: { type: "Literal", value: 7 } },
        { type: "ExpressionStatement", expression: { type: "Literal", value: 99 } }
      ]
    };

    const result = runtime.controlFlow.dispatch(ast);

    // returned value should bubble out of the block
    expect(result).toEqual({ type: "return", value: 7 });
  });

  it("bubbles through nested BlockStatements", () => {
    const runtime = new RuntimeEngine();
    runtime.init();

    const ast = {
      type: "BlockStatement",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "BlockStatement",
              body: [
                { type: "ReturnStatement", argument: { type: "Literal", value: 123 } }
              ]
            },
            { type: "ExpressionStatement", expression: { type: "Literal", value: 999 } }
          ]
        }
      ]
    };

    const result = runtime.controlFlow.dispatch(ast);

    expect(result).toEqual({ type: "return", value: 123 });
  });
});
