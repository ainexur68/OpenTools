#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# OpenTools: 新工具模板创建脚本
#
# 作用：
#   1. 在 src/tools/<toolId>/ 下生成基础工具模块（React + TS）
#   2. 自动生成 meta.ts 和 index.tsx
#   3. 若存在 script/extend-icons.sh，则自动更新工具图标系统
#
# 用法：
#   chmod +x script/create-tool.sh
#   ./script/create-tool.sh <tool-id> [Tool Display Name]
#
# 示例：
#   ./script/create-tool.sh date-diff "日期差计算器"
#
# 注意：
#   - 请确保此文件使用 LF 换行（避免 /usr/bin/env: 'bash\r' 错误）
#   - 同一个 toolId 多次执行不会覆盖已存在文件（幂等）
# -----------------------------------------------------------------------------

set -euo pipefail

# 当前脚本所在目录 & 项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TOOLS_DIR="${PROJECT_ROOT}/src/tools"

# -----------------------------------------------------------------------------
# 工具函数：打印用法
# -----------------------------------------------------------------------------
print_usage() {
  cat <<EOF
用法：
  $(basename "$0") <tool-id> [Tool Display Name]

示例：
  $(basename "$0") date-diff "日期差计算器"

说明：
  - <tool-id> 建议使用 kebab-case（例如：date-diff, hash-tool, geo-convert）
  - 若不提供显示名，将从 tool-id 自动生成标题（例如：date-diff -> Date Diff）
EOF
}

# -----------------------------------------------------------------------------
# 参数解析
# -----------------------------------------------------------------------------
if [[ $# -lt 1 ]]; then
  echo "❌ 缺少必需参数 <tool-id>"
  print_usage
  exit 1
fi

TOOL_ID="$1"
DISPLAY_NAME="${2:-}"

# 规范化：删除首尾空白
TOOL_ID="$(echo "${TOOL_ID}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
DISPLAY_NAME="$(echo "${DISPLAY_NAME}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

if [[ -z "${TOOL_ID}" ]]; then
  echo "❌ 无效的 tool-id"
  print_usage
  exit 1
fi

# -----------------------------------------------------------------------------
# 从 tool-id 生成默认标题（如未指定显示名）
# 规则：非字母数字替换为空格，每个单词首字母大写
# -----------------------------------------------------------------------------
if [[ -z "${DISPLAY_NAME}" ]]; then
  DISPLAY_NAME="$(echo "${TOOL_ID}" \
    | sed -E 's/[^a-zA-Z0-9]+/ /g' \
    | awk '{
        for (i=1; i<=NF; i++) {
          $i = toupper(substr($i,1,1)) substr($i,2)
        }
        print
      }')"
fi

# -----------------------------------------------------------------------------
# 生成组件名（PascalCase + Tool 后缀）
# 例如：date-diff -> DateDiffTool
# -----------------------------------------------------------------------------
PASCAL_NAME="$(echo "${TOOL_ID}" \
  | sed -E 's/[^a-zA-Z0-9]+/ /g' \
  | awk '{
      for (i=1; i<=NF; i++) {
        $i = toupper(substr($i,1,1)) substr($i,2)
      }
      print
    }' \
  | tr -d ' ')"

COMPONENT_NAME="${PASCAL_NAME}Tool"

# -----------------------------------------------------------------------------
# 目标目录 & 文件路径
# -----------------------------------------------------------------------------
TOOL_DIR="${TOOLS_DIR}/${TOOL_ID}"
META_FILE="${TOOL_DIR}/meta.ts"
INDEX_FILE="${TOOL_DIR}/index.tsx"

echo "🛠  [create-tool] Project root: ${PROJECT_ROOT}"
echo "🧩 [create-tool] Tool ID       : ${TOOL_ID}"
echo "🔤 [create-tool] Display Name  : ${DISPLAY_NAME}"
echo "🏷  [create-tool] Component    : ${COMPONENT_NAME}"

# -----------------------------------------------------------------------------
# 检查是否已存在
# -----------------------------------------------------------------------------
if [[ -d "${TOOL_DIR}" ]]; then
  echo "⚠️  [create-tool] 工具目录已存在：${TOOL_DIR}"
  echo "    不会覆盖已有文件。若需重新创建，请手动删除该目录后重试。"
  exit 0
fi

# -----------------------------------------------------------------------------
# 创建目录
# -----------------------------------------------------------------------------
mkdir -p "${TOOL_DIR}"

# -----------------------------------------------------------------------------
# 生成 meta.ts
# -----------------------------------------------------------------------------
cat > "${META_FILE}" <<EOF
// 此文件由 script/create-tool.sh 自动生成
// 如需修改标题、描述或关键词，可在此编辑。

export const toolId = "${TOOL_ID}" as const;

export const toolMeta = {
  id: toolId,
  title: "${DISPLAY_NAME}",
  description: "TODO: 补充 ${DISPLAY_NAME} 工具的功能说明。",
  keywords: ["${TOOL_ID}", "${DISPLAY_NAME}"],
  category: "general",
} as const;

export type ToolMeta = typeof toolMeta;
EOF

# -----------------------------------------------------------------------------
# 生成 index.tsx
# -----------------------------------------------------------------------------
cat > "${INDEX_FILE}" <<EOF
import React from "react";
import { toolId, toolMeta } from "./meta";

export { toolId, toolMeta };

export const ${COMPONENT_NAME}: React.FC = () => {
  return (
    <div className="p-4 space-y-3">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">
          {toolMeta.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {toolMeta.description}
        </p>
      </header>

      <section className="text-sm text-muted-foreground">
        <p>TODO: 在这里实现 <strong>{toolMeta.title}</strong> 的具体功能。</p>
        <p className="mt-2">
          你可以参考其他工具的实现，复用常用组件、hooks 和样式。
        </p>
      </section>
    </div>
  );
};

export default ${COMPONENT_NAME};
EOF

echo "✅ [create-tool] 已生成工具目录：${TOOL_DIR}"
echo "   - ${META_FILE}"
echo "   - ${INDEX_FILE}"

# -----------------------------------------------------------------------------
# 与图标系统联动：如有 script/extend-icons.sh 则自动执行
# -----------------------------------------------------------------------------
EXTEND_ICONS_SCRIPT="${SCRIPT_DIR}/extend-icons.sh"

if [[ -x "${EXTEND_ICONS_SCRIPT}" ]]; then
  echo "🔄 [create-tool] 检测到图标扩展脚本，正在更新工具图标系统..."
  "${EXTEND_ICONS_SCRIPT}"
else
  echo "ℹ️  [create-tool] 未检测到可执行的 script/extend-icons.sh"
  echo "    如需自动生成工具图标及映射，请准备好该脚本后手动执行："
  echo "      ./script/extend-icons.sh"
fi

echo "🎉 [create-tool] 新工具已创建完成：${TOOL_ID}"
