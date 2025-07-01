#!/bin/bash

# Exit immediately if any command fails
set -e

echo "Starting custom build process..."

# Check if the N8N_WEBHOOK_URL environment variable is set
if [ -z "$N8N_WEBHOOK_URL" ]; then
  echo "Error: N8N_WEBHOOK_URL environment variable is not set in Netlify."
  # It's good practice to exit with an error code if a critical variable is missing
  exit 1
fi

# Perform the substitution in script.js using sed
# This is the original sed command, but now it's in a pure bash script
# so shell expansion works as expected.
sed -i 's|__N8N_WEBHOOK_URL__|'"$N8N_WEBHOOK_URL"'|g' script.js

echo "N8N_WEBHOOK_URL successfully injected into script.js."
echo "Build complete."

# You don't need to specify 'publish' here, that's still in netlify.toml