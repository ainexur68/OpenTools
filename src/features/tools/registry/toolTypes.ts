import type { ComponentType } from "react";

export interface ToolMeta {
  /** 唯一标识（与目录、路由保持一致） */
  readonly id: string;
  /** UI 上显示的名称 */
  readonly name: string;
  /** 简要描述，展示在卡片与工具页 */
  readonly description: string;
  /** 工具所属分类（如：日期与时间 / 编码与安全） */
  readonly category: string;
  /** 访问路由，例如 /tools/date-diff */
  readonly route: string;
  /** 图标键名，对应图标系统中的映射 */
  readonly icon: string;
  /** 搜索关键词，提升可发现性 */
  readonly keywords?: readonly string[];
  /** 排序权重，数字越小越靠前 */
  readonly order?: number;
  /** 是否在 UI 中隐藏（用于灰度、占位等场景） */
  readonly disabled?: boolean;
}

export interface ToolRegistryEntry {
  readonly id: string;
  readonly meta: ToolMeta;
  readonly modulePath: string;
  readonly load: () => Promise<ToolComponentModule>;
}

export interface ToolComponentModule {
  readonly default: ComponentType;
  readonly [key: string]: unknown;
}
