#!/bin/bash
# Usage: ./scripts/minify-css.sh
# Requires npm install -g clean-css-cli

set -e

cleancss -o styles.min.css styles.css
