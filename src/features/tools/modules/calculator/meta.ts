import type { ToolMeta } from "@/features/tools/registry/toolTypes";

export const toolId = "calculator" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "通用计算器",
  description: "输入两个数字，实时查看加减乘除等常用运算结果。",
  category: "计算类",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["calculator", "加法", "除法", "乘法", "减法"],
  order: 5
};

export default toolMeta;
