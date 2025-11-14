import type { ToolMeta } from "@/core/registry/toolTypes";

export const toolId = "dependency-checker" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "依赖差异检测器",
  description: "粘贴 package.json 依赖信息，一键识别缺失项并生成安装命令。",
  category: "项目维护",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["npm", "依赖", "安装", "react-router-dom", "排错"],
  order: 40
};

export default toolMeta;
