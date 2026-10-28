CURRENT_TIME := datetime("%Y-%m-%d %H:%M:%S")

update_assets:
  mkdir -p ./docs
  if [ -d "./docs/assets" ]; then rm -r "./docs/assets"; fi
  bun src/main.tsx
  cp -r ./src/assets ./docs

build:
  bun src/main.tsx

update: update_assets
  git add .
  git commit -m "{{CURRENT_TIME}} - update project status"
  git push