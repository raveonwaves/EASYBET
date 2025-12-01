#!/usr/bin/env bash
set -euo pipefail

pushd backend >/dev/null
npm install
npx prisma generate
popd >/dev/null

pushd frontend >/dev/null
npm install
popd >/dev/null

echo "Install complete"
