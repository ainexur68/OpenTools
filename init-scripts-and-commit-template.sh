#!/usr/bin/env bash
set -euo pipefail

echo "🛠 Initializing scripts/ directory and commit template..."

mkdir -p scripts
chmod +x scripts/*.sh 2>/dev/null || true

echo "📁 Ensured scripts/ directory exists."

cat > .commit-template <<'EOT'
# 📝 Commit Message Template for OpenTools
#
# 使用方式：
#   git commit 会自动加载本模板（prepare-commit-msg 钩子会在文本为空时填入）
#
# 约定：
#   TYPE: feat / fix / chore / docs / refactor / style / perf / test
#   SCOPE: 例如 tools/hash-calculator、theme、scripts
#
# 示例：
# feat(tools/hash-calculator): support multi-hash output
#
TYPE(SCOPE): SHORT_DESCRIPTION

## Summary
- 变更一
- 变更二

## Testing
- [ ] npm run typecheck
- [ ] npm run test
- [ ] npm run build

## Notes (可选)
- 其他补充说明
EOT

echo "📄 Created .commit-template file."

mkdir -p .git/hooks

cat > .git/hooks/prepare-commit-msg <<'EOT'
#!/usr/bin/env bash
MSG_FILE=$1

if [[ ! -s "$MSG_FILE" ]]; then
  cat .commit-template >> "$MSG_FILE"
fi
EOT

chmod +x .git/hooks/prepare-commit-msg

echo "🔧 Installed prepare-commit-msg Git hook."

echo "✅ Initialization complete."
