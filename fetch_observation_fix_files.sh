#!/bin/bash
# fetch_observation_fix_files.sh
# Gathers key files involved in the observation capture fix
OUTPUT="./observation_fix_bundle.txt" 
FILES=(
  ./runtime-time/control-flow-workflow.js
  ./runtime-time/expression-evaluator.js
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