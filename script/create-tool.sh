#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# OpenTools: 新工具模板创建脚本
#
# 作用：
#   1. 在 src/tools/<tool-id>/ 下生成基础工具模块（React + TypeScript）
#   2. 自动生成 config.ts（ToolMeta）和 index.tsx
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
#   - 同一个 tool-id 多次执行不会覆盖已存在文件（幂等）
# -----------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TOOLS_DIR="${PROJECT_ROOT}/src/tools"

print_usage() {
  cat <<'USAGE'
用法：
  ./script/create-tool.sh <tool-id> [Tool Display Name]

示例：
  ./script/create-tool.sh date-diff "日期差计算器"

说明：
  - <tool-id> 建议使用 kebab-case（例如：date-diff, hash-tool, geo-convert）
  - 若不提供显示名，将从 tool-id 自动生成标题（例如：date-diff -> Date Diff）
USAGE
}

if [[ $# -lt 1 ]]; then
  echo "❌ 缺少必需参数 <tool-id>"
  print_usage
  exit 1
fi

TOOL_ID="$1"
DISPLAY_NAME="${2:-}"

TOOL_ID="$(echo "${TOOL_ID}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
DISPLAY_NAME="$(echo "${DISPLAY_NAME}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

if [[ -z "${TOOL_ID}" ]]; then
  echo "❌ 无效的 tool-id"
  print_usage
  exit 1
fi

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

TOOL_DIR="${TOOLS_DIR}/${TOOL_ID}"
CONFIG_FILE="${TOOL_DIR}/config.ts"
INDEX_FILE="${TOOL_DIR}/index.tsx"

echo "🛠  [create-tool] Project root: ${PROJECT_ROOT}"
echo "🧩 [create-tool] Tool ID       : ${TOOL_ID}"
echo "🔤 [create-tool] Display Name  : ${DISPLAY_NAME}"
echo "🏷  [create-tool] Component    : ${COMPONENT_NAME}"

if [[ -d "${TOOL_DIR}" ]]; then
  echo "⚠️  [create-tool] 工具目录已存在：${TOOL_DIR}"
  echo "    不会覆盖已有文件。若需重新创建，请手动删除该目录后重试。"
  exit 0
fi

mkdir -p "${TOOL_DIR}"

cat > "${CONFIG_FILE}" <<EOF
// 此文件由 script/create-tool.sh 自动生成
// 如需修改名称、描述或关键词，可在此编辑。

import type { ToolMeta } from "@/core/registry/toolTypes";

export const toolId = "${TOOL_ID}" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "${DISPLAY_NAME}",
  description: "TODO: 补充 ${DISPLAY_NAME} 工具的功能说明。",
  category: "general",
  route: `/tools/\${toolId}`,
  icon: "${TOOL_ID}",
  keywords: ["${TOOL_ID}", "${DISPLAY_NAME}"],
};

export default toolMeta;
EOF

cat > "${INDEX_FILE}" <<EOF
import React, { useMemo, useState } from "react";
import toolMeta, { toolId } from "./config";

export { toolId, toolMeta };

export const ${COMPONENT_NAME}: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string[]>([]);

  const placeholder = useMemo(
    () => [
      "TODO: 在这里实现工具的核心逻辑。",
      "可以使用 useState / useMemo / 自定义 hooks 管理状态。",
      "如需添加脚本或图标，请执行 script/extend-icons.sh。"
    ],
    []
  );

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{toolMeta.name}</h1>
        <p>{toolMeta.description}</p>
      </header>

      <section className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          示例输入
        </label>
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-white/90 p-3 text-sm text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:focus:border-indigo-400"
          placeholder="根据工具的实际需求调整输入内容"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-indigo-500 bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={() => setResult([`你输入了：\${input || "<空>"}`])}
        >
          运行示例
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          开发提示
        </h2>
        <ul className="list-inside list-disc space-y-1">
          {placeholder.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      {result.length > 0 && (
        <section className="space-y-1">
          <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            输出
          </h2>
          <div className="rounded-lg border border-slate-200 bg-white/90 p-3 text-xs dark:border-slate-700 dark:bg-slate-950/60">
            {result.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ${COMPONENT_NAME};
EOF

echo "✅ [create-tool] 已生成工具目录：${TOOL_DIR}"
echo "   - ${CONFIG_FILE}"
echo "   - ${INDEX_FILE}"

declare -r EXTEND_ICONS_SCRIPT="${SCRIPT_DIR}/extend-icons.sh"

if [[ -x "${EXTEND_ICONS_SCRIPT}" ]]; then
  echo "🔄 [create-tool] 检测到图标扩展脚本，正在更新工具图标系统..."
  "${EXTEND_ICONS_SCRIPT}"
else
  echo "ℹ️  [create-tool] 未检测到可执行的 script/extend-icons.sh"
  echo "    如需自动生成工具图标及映射，请准备好该脚本后手动执行："
  echo "      ./script/extend-icons.sh"
fi

echo "🎉 [create-tool] 新工具已创建完成：${TOOL_ID}"
