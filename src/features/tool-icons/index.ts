/*
 * 此文件由 script/extend-icons.sh 自动生成，请不要手动修改。
 * 重新执行脚本会覆盖此文件。
 */

// Vite + TypeScript 图标映射

export const toolIcons = {
  "date-diff": new URL("../../assets/tool-icons/date-diff.svg", import.meta.url).href,
} as const;

export type ToolIdWithIcon = keyof typeof toolIcons;

export function getToolIcon(toolId: string): string | undefined {
  return toolIcons[toolId as ToolIdWithIcon];
}

export default toolIcons;
