#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# OpenTools: 自动生成工具图标系统
#
# 作用：
#   1. 扫描 src/tools 下的工具目录（每个子目录视为一个 toolId）
#   2. 为每个 toolId 生成占位 SVG 图标（若不存在）
#   3. 生成 src/icons/index.ts 图标映射文件
#
# 使用：
#   chmod +x script/extend-icons.sh
#   ./script/extend-icons.sh
#
# 注意：
#   - 请确保此文件使用 LF 换行
#   - 本脚本可多次执行，结果是幂等的
# -----------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TOOLS_DIR="${PROJECT_ROOT}/src/tools"
ICONS_DIR="${PROJECT_ROOT}/src/icons/tool"
ICONS_INDEX_FILE="${PROJECT_ROOT}/src/icons/index.ts"

mkdir -p "${ICONS_DIR}"

if [[ ! -d "${TOOLS_DIR}" ]]; then
  echo "⚠️  [extend-icons] 工具目录不存在：${TOOLS_DIR}"
  echo "    将仍然生成空的图标映射文件。"
fi

tool_ids=()
if [[ -d "${TOOLS_DIR}" ]]; then
  while IFS= read -r -d '' dir; do
    tool_id="$(basename "${dir}")"
    tool_ids+=("${tool_id}")
  done < <(find "${TOOLS_DIR}" -maxdepth 1 -mindepth 1 -type d -print0 | sort -z)
fi

printf '🧩 [extend-icons] 检测到工具数量：%d\n' "${#tool_ids[@]}"

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

cat > "${ICONS_INDEX_FILE}" <<'EOF'
/*
 * 此文件由 script/extend-icons.sh 自动生成，请不要手动修改。
 * 重新执行脚本会覆盖此文件。
 */

export const toolIcons = {
EOF

for tool_id in "${tool_ids[@]}"; do
  echo "  \"${tool_id}\": new URL(\"./tool/${tool_id}.svg\", import.meta.url).href," >> "${ICONS_INDEX_FILE}"
done

echo "} as const;" >> "${ICONS_INDEX_FILE}"
echo >> "${ICONS_INDEX_FILE}"
cat <<'EOF' >> "${ICONS_INDEX_FILE}"
export type ToolIdWithIcon = keyof typeof toolIcons;

export function getToolIcon(toolId: string): string | undefined {
  return toolIcons[toolId as ToolIdWithIcon];
}

export default toolIcons;
EOF

cat <<EOF
✅ [extend-icons] 图标系统生成完成。
   图标目录：${ICONS_DIR}
   映射文件：${ICONS_INDEX_FILE}
EOF
