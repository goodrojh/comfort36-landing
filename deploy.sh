#!/usr/bin/env bash
# Сборка и публикация на GitHub Pages (ветка gh-pages).
set -e

REPO_URL="https://github.com/goodrojh/comfort36-landing.git"

BASE_PATH="/comfort36-landing/" npm run build
touch dist/.nojekyll

rm -rf dist/.git
cd dist
git init -q -b gh-pages
git add -A
git commit -q -m "deploy: $(date +%Y-%m-%d\ %H:%M)"
git push -q -f "$REPO_URL" gh-pages
rm -rf .git

echo "Опубликовано: https://goodrojh.github.io/comfort36-landing/"
