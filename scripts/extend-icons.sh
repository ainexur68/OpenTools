#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# OpenTools: 自动生成工具图标系统
#
# 作用：
#   1. 扫描 src/features/tools/modules 下的工具目录（每个子目录视为一个 toolId）
#   2. 为每个 toolId 生成占位 SVG 图标（若不存在）
#   3. 生成 src/assets/icons/index.ts 图标映射文件
#
# 使用：
#   chmod +x scripts/extend-icons.sh
#   ./scripts/extend-icons.sh
#
# 注意：
#   - 请确保此文件使用 LF 换行（避免 /usr/bin/env: 'bash\r' 错误）
#   - 本脚本可多次执行，结果是幂等的
# -----------------------------------------------------------------------------

set -euo pipefail

# 当前脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TOOLS_DIR="${PROJECT_ROOT}/src/features/tools/modules"
ICONS_DIR="${PROJECT_ROOT}/src/assets/icons/tools"
ICONS_TS_FILE="${PROJECT_ROOT}/src/assets/icons/index.ts"

echo "🧩 [extend-icons] Project root: ${PROJECT_ROOT}"

# 确保基础目录存在
mkdir -p "${ICONS_DIR}"
mkdir -p "${PROJECT_ROOT}/src/assets/icons"

if [[ ! -d "${TOOLS_DIR}" ]]; then
  echo "⚠️  [extend-icons] 工具目录不存在：${TOOLS_DIR}"
  echo "    将仍然生成空的图标映射文件。"
fi

# 收集 toolId（即 src/features/tools/modules 下的一级子目录名）
tool_ids=()
if [[ -d "${TOOLS_DIR}" ]]; then
  while IFS= read -r -d '' dir; do
    tool_id="$(basename "${dir}")"
    tool_ids+=("${tool_id}")
  done < <(find "${TOOLS_DIR}" -maxdepth 1 -mindepth 1 -type d -print0 | sort -z)
fi

echo "🔍 [extend-icons] 检测到工具数量：${#tool_ids[@]}"

# 为每个工具生成默认 SVG 图标（如不存在）
generate_svg_icon() {
  local tool_id="$1"
  local icon_path="${ICONS_DIR}/${tool_id}.svg"

  if [[ -f "${icon_path}" ]]; then
    echo "✅ [extend-icons] 已存在图标：${icon_path}"
    return
  fi

  echo "✨ [extend-icons] 生成占位图标：${icon_path}"

  cat > "${icon_path}" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${tool_id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <rect x="8" y="8" rx="16" ry="16" width="80" height="80" fill="url(#grad-${tool_id})"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="14" fill="#ffffff">
    ${tool_id}
  </text>
</svg>
EOF
}

for tool_id in "${tool_ids[@]}"; do
  generate_svg_icon "${tool_id}"
done

# 生成 TypeScript 图标映射文件
echo "📝 [extend-icons] 生成 TypeScript 图标映射：${ICONS_TS_FILE}"

{
  echo "/*"
  echo " * 此文件由 scripts/extend-icons.sh 自动生成，请不要手动修改。"
  echo " * 重新执行脚本会覆盖此文件。"
  echo " */"
  echo
  echo "// Vite + TypeScript 图标映射"
  echo
  echo "export const toolIcons = {"
  if ((${#tool_ids[@]} > 0)); then
    for tool_id in "${tool_ids[@]}"; do
      echo "  \"${tool_id}\": new URL(\"./tools/${tool_id}.svg\", import.meta.url).href,"
    done
  fi
  echo "} as const;"
  echo
  echo "export type ToolIdWithIcon = keyof typeof toolIcons;"
  echo
  echo "export function getToolIcon(toolId: string): string | undefined {"
  echo "  return toolIcons[toolId as ToolIdWithIcon];"
  echo "}"
  echo
  echo "export default toolIcons;"
} > "${ICONS_TS_FILE}"

echo "✅ [extend-icons] 图标系统生成完成。"
echo "   图标目录：${ICONS_DIR}"
echo "   映射文件：${ICONS_TS_FILE}"
