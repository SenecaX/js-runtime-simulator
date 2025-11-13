#!/bin/bash
# fetch_observation_fix_files.sh
# Gathers key files involved in the observation capture fix
OUTPUT="./observation_fix_bundle.txt" 
FILES=(
  ./demo/run-uc01-integration.js
  ./ui/terminal-renderer.js

  ./runtime-time/environment-router.js
  ./runtime-time/expression-evaluator.js
  ./runtime-time/context-lifecycle-workflow.js
  ./runtime-time/control-flow-workflow.js
  ./runtime-time/variable-resolution-workflow.js

  ./core/stack.js

  ./runtime-space/variable-environment.js
  ./runtime-space/lexical-environment.js
  ./runtime-space/scope-chain.js
  ./runtime-space/execution-context.js
  ./runtime-space/call-stack.js

  ./engine/runtime-engine.js
)


# Clear output
> "$OUTPUT"

# Loop through files and append content with headers
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "\n\n===== $file =====\n" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
  else
    echo -e "\n\n===== $file (NOT FOUND) =====\n" >> "$OUTPUT"
  fi
done

echo "✅ All requested files bundled into $OUTPUT"