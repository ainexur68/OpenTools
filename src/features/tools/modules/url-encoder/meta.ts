import type { ToolMeta } from "@/features/tools/registry/toolTypes";

export const toolId = "url-encoder" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "URL 编码解码",
  description: "支持 encodeURIComponent / encodeURI 互转，并提供 + 空格兼容处理。",
  category: "编码与安全",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["url", "encode", "decode", "uri", "component"],
  order: 14
};

export default toolMeta;
