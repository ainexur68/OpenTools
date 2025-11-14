import type { ToolMeta } from "@/features/tools/registry/toolTypes";

export const toolId = "hash-calculator" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "哈希计算工具",
  description: "支持 MD5、SHA-1、SHA-256 等常见算法的文本摘要计算。",
  category: "编码与安全",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["hash", "md5", "sha", "摘要", "加密"],
  order: 12
};

export default toolMeta;
