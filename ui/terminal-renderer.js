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
    return "{ " + entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ") + " }";
  }

  static formatCallStack(frames) {
    return frames
      .map((ctx, i) => `  [${i}] ${ctx.summary()}`)
      .join("\n");
  }
}
