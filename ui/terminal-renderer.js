export class TerminalRenderer {
  static header(label) {
    return `\n${label}\n${"-".repeat(40)}`;
  }

  static block(label, content) {
    return `${label}:\n${content}`;
  }

  static formatEnv(env) {
    const entries = Object.entries(env.environmentRecord);
    if (entries.length === 0) return "{}";
    return (
      "{ " +
      entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ") +
      " }"
    );
  }

  static formatCallStack(frames) {
    return frames.map((ctx, i) => `  [${i}] ${ctx.summary()}`).join("\n");
  }

  static formatEnvChain(env) {
    let output = [];
    let cur = env;
    let level = 0;

    while (cur) {
      const entries = Object.entries(cur.environmentRecord)
        .map(([k, v]) => {
          if (v && v.type === "FunctionObject") {
            return `${k}: [FunctionObject ${v.name}]`;
          }
          return `${k}: ${JSON.stringify(v)}`;
        })

        .join(", ");

      output.push(`  [${level}] { ${entries} }`);
      cur = cur.outer;
      level++;
    }

    return output.join("\n");
  }
}
