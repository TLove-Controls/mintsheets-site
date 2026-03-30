#!/bin/bash
# Simple git add, commit, and push script
# Usage: ./scripts/git-push.sh "your commit message"
# If no message provided, uses default

set -e

# Get commit message from argument or use default
MESSAGE="${1:-Update site improvements}"

echo "🔄 Adding all changes..."
git add .

echo "💾 Committing with message: '$MESSAGE'"
git commit -m "$MESSAGE"

echo "🚀 Pushing to remote..."
git push

echo "✅ Done! Changes pushed to GitHub."
