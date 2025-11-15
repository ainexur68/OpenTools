/*
 * 此文件由 scripts/extend-icons.sh 自动生成，请不要手动修改。
 * 重新执行脚本会覆盖此文件。
 */

// Vite + TypeScript 图标映射

export const toolIcons = {
  "base64-converter": new URL("./tools/base64-converter.svg", import.meta.url).href,
  "calculator": new URL("./tools/calculator.svg", import.meta.url).href,
  "date-diff": new URL("./tools/date-diff.svg", import.meta.url).href,
  "dependency-checker": new URL("./tools/dependency-checker.svg", import.meta.url).href,
  "hash-calculator": new URL("./tools/hash-calculator.svg", import.meta.url).href,
  "url-encoder": new URL("./tools/url-encoder.svg", import.meta.url).href,
} as const;

export type ToolIdWithIcon = keyof typeof toolIcons;

export function getToolIcon(toolId: string): string | undefined {
  return toolIcons[toolId as ToolIdWithIcon];
}

export default toolIcons;
