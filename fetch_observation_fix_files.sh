#!/bin/bash
# fetch_observation_fix_files.sh
# Gathers key files involved in the observation capture fix
OUTPUT="./observation_fix_bundle.txt" 
FILES=(
  ./core/engine/runtime-engine.js

  ./core/primitive/stack.js

  ./core/ui/engine-renderer.js
  ./core/ui/terminal-renderer.js

  ./core/time/environment-selector.js
  ./core/time/expression-evaluator.js
  ./core/time/function-object.js
  ./core/time/context-lifecycle.js
  ./core/time/control-flow.js
  ./core/time/variable-resolution.js

  ./core/space/variable-environment.js
  ./core/space/lexical-environment.js
  ./core/space/scope-chain.js
  ./core/space/execution-context.js
  ./core/space/call-stack.js

  ./core/instantiation/instantiation-workflow.js
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