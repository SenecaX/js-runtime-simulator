export class TerminalRenderer {
  static header(label) {
    return `\n${label}\n${"-".repeat(40)}`;
  }

  static block(label, content) {
    return `${label}:\n${content}`;
  }

  // ───────────────────────────────────────
  // CALL STACK (tree style)
  // ───────────────────────────────────────
  static formatCallStack(frames) {
    return frames
      .map((ctx, i) => {
        const indent = "  ".repeat(i);
        return `${indent}└─ ${ctx.summary()}`;
      })
      .join("\n");
  }

  // ───────────────────────────────────────
  // LEXICAL ENV CHAIN (annotated tree)
  // ───────────────────────────────────────
  static formatLexicalChain(env) {
    let lines = [];
    let cur = env;
    let depth = 0;

    while (cur) {
      const indent = "  ".repeat(depth);
      const label = depth === 0 ? "current lexical env" : "outer lexical env";

      const entries = this._formatEnvEntries(cur.environmentRecord);
      lines.push(`${indent}└─ ${label}: ${entries}`);

      cur = cur.outer;
      depth++;
    }

    return lines.join("\n");
  }

  // ───────────────────────────────────────
  // VARIABLE ENV CHAIN (annotated tree)
  // ───────────────────────────────────────
  static formatVariableChain(env) {
    let lines = [];
    let cur = env;
    let depth = 0;

    while (cur) {
      const indent = "  ".repeat(depth);
      const label = depth === 0 ? "current var env" : "outer var env";

      const entries = this._formatEnvEntries(cur.environmentRecord);
      lines.push(`${indent}└─ ${label}: ${entries}`);

      cur = cur.outer;
      depth++;
    }

    return lines.join("\n");
  }

  // ───────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────
  static _formatEnvEntries(record) {
    const entries = Object.entries(record);
    if (entries.length === 0) return "{}";

    return (
      "{ " +
      entries
        .map(([k, v]) => {
          if (v?.type === "FunctionObject") {
            return `${k}: [FunctionObject ${v.name}]`;
          }
          return `${k}: ${JSON.stringify(v)}`;
        })
        .join(", ") +
      " }"
    );
  }
}
