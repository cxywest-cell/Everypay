#!/bin/bash
set -e

echo "=> Killing existing processes on port 3000..."
fuser -k 3000/tcp 2>/dev/null || echo "   No process found on port 3000"
sleep 2

echo "=> Clearing Next.js cache (.next)..."
rm -rf .next

echo "=> Starting dev server on port 3000..."
npx next dev --port 3000
