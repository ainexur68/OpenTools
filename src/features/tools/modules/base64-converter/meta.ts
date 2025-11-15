import type { ToolMeta } from "@/features/tools/registry/toolTypes";

export const toolId = "base64-converter" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "Base64 编码解码",
  description: "在文本与 Base64 字符串之间快速互转，支持错误检测与复制结果。",
  category: "编码与安全",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["base64", "编码", "解码", "encode", "decode"],
  order: 13
};

export default toolMeta;
