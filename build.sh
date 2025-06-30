#!/bin/bash
# build.sh - Create this file in your repository root

# Create a JavaScript file with environment variables
cat > env.js << EOF
window.env = {
  N8N_WEBHOOK_URL: '${N8N_WEBHOOK_URL}'
};
EOF

echo "Environment variables injected successfully"