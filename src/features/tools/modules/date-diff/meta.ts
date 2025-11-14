import type { ToolMeta } from "@/features/tools/registry/toolTypes";

export const toolId = "date-diff" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "日期差计算器",
  description: "输入开始与结束时间，快速计算天数、小时和分钟差异。",
  category: "日期与时间",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["date", "diff", "时间差", "duration"],
  order: 10
};

export default toolMeta;
