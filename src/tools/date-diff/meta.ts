// 此文件由 script/create-tool.sh 自动生成
// 如需修改标题、描述或关键词，可在此编辑。

export const toolId = "date-diff" as const;

export const toolMeta = {
  id: toolId,
  title: "日期差计算器",
  description: "TODO: 补充 日期差计算器 工具的功能说明。",
  keywords: ["date-diff", "日期差计算器"],
  category: "general",
} as const;

export type ToolMeta = typeof toolMeta;
