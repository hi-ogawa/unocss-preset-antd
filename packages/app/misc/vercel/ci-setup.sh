#!/bin/bash
set -eu -o pipefail

# workaround poor limitatoins of vercel cli workflow on CI
# by generating config files directly
# https://github.com/vercel/vercel/issues/1937

# https://vercel.com/docs/project-configuration#global-configuration/auth-json
# https://github.com/vercel/vercel/blob/72265aa9a117e881d8ae4aab6c00d49503e7b0e3/packages/cli/src/util/config/global-path.ts#L18
# https://github.com/vercel/vercel/blob/72265aa9a117e881d8ae4aab6c00d49503e7b0e3/packages/cli/src/util/config/files.ts#L15-L17
config_dir="$HOME/.local/share/com.vercel.cli"

mkdir -p "$config_dir"

cat > "$config_dir/auth.json" <<EOF
{
  "token": "$VERCEL_TOKEN"
}
EOF

cat > "$config_dir/config.json" <<EOF
{}
EOF
