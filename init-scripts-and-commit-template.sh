#!/bin/bash
set -e

echo "🛠 Initializing script directory + commit message template..."

############################################
# 1. 创建 script/ 目录
############################################
mkdir -p script
chmod +x script/*.sh 2>/dev/null || true
echo "📁 Ensured script/ directory exists."

############################################
# 2. 创建 .commit-template（Git Commit 模板）
############################################
cat > .commit-template <<'EOF'
# 📝 Commit Message Template for OpenTools
#
# 使用方式：
#   git commit 会自动加载本模板（因为 prepare-commit-msg 钩子）
#
# 填写说明：
#   TYPE: feat / fix / chore / docs / refactor / style / perf
#   SCOPE: 例如 base64 / autoscan / dark-mode / init
#
# 示例：
# feat(base64): add Base64 tool
#
# 👇 按以下结构填写 👇

TYPE(SCOPE): SHORT_DESCRIPTION

## Prompt
<写入你发送给 AI 的 Prompt 内容>

## Script Generated
<对应生成的脚本文件，例如 script/create-tool.sh>

## Summary
- 本次更新包含哪些内容？
- 哪些文件发生了变更？
- 有什么注意事项？

## Remarks (可选)
- 其他补充说明
- 依赖的步骤

EOF

echo "📄 Created .commit-template file."

############################################
# 3. 创建 Git Hook: prepare-commit-msg
############################################
mkdir -p .git/hooks

cat > .git/hooks/prepare-commit-msg <<'EOF'
#!/bin/bash

MSG_FILE=$1

if [ -s "$MSG_FILE" ]; then
  exit 0
fi

cat .commit-template >> "$MSG_FILE"
EOF

chmod +x .git/hooks/prepare-commit-msg

echo "🔧 Installed prepare-commit-msg Git hook."

############################################
# 4. 在 README 增加 AI Commit 说明（如果没有）
############################################
if ! grep -q "AI-Driven Development" README.md; then
  echo "📝 Updating README.md with AI-driven development section..."

cat >> README.md <<'EOF'

---

## 🤖 AI-Driven Development (Commit-Based)

OpenTools 的开发完全采用 **AI 辅助开发流程**。

每个 commit 都包含：

- 你发送给 AI 的 Prompt
- AI 返回的脚本文件位置
- 本次变更的 Summary 说明

所有自动生成脚本统一存放在：

- `script/` —— 当前可执行脚本
- `scripts/` —— 历史脚本归档（可选）

EOF
fi

echo "✅ Initialization complete."
