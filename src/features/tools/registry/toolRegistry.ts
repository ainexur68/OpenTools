import type { ToolMeta, ToolRegistryEntry, ToolComponentModule } from "./toolTypes";

interface ToolMetaModule {
  readonly default?: ToolMeta;
  readonly toolMeta?: ToolMeta;
  readonly meta?: ToolMeta;
}

const metaModules = import.meta.glob<ToolMetaModule>("../modules/**/meta.ts", {
  eager: true
});

const componentModules = import.meta.glob<ToolComponentModule>("../modules/**/index.tsx");

const toEntry = ([modulePath, mod]: [string, ToolMetaModule]): ToolRegistryEntry | null => {
  const meta = mod.toolMeta ?? mod.default ?? mod.meta;

  if (!meta) {
    console.warn(`[toolRegistry] 未在 ${modulePath} 找到导出的 toolMeta`);
    return null;
  }

  const normalized: ToolMeta = {
    ...meta,
    route: meta.route?.startsWith("/") ? meta.route : `/tools/${meta.id}`
  };

  const toolDir = modulePath.replace(/[\\/]meta\.tsx?$/, "");
  const componentPath = `${toolDir}/index.tsx`;
  const load = componentModules[componentPath];

  if (!load) {
    console.warn(`[toolRegistry] 未找到 ${componentPath} 对应的 React 组件模块`);
    return null;
  }

  return {
    id: normalized.id,
    meta: normalized,
    modulePath,
    load
  };
};

const entries = Object.entries(metaModules)
  .map(toEntry)
  .filter((entry): entry is ToolRegistryEntry => Boolean(entry))
  .sort((a, b) => {
    const orderA = a.meta.order ?? 9999;
    const orderB = b.meta.order ?? 9999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.meta.name.localeCompare(b.meta.name, "zh-Hans-CN");
  });

const entryMap = entries.reduce<Record<string, ToolRegistryEntry>>((acc, entry) => {
  acc[entry.id] = entry;
  return acc;
}, {});

export const toolRegistryEntries = entries;
export const toolMetaList: ToolMeta[] = entries.map((entry) => entry.meta);
export const toolMetaMap: Record<string, ToolMeta> = entries.reduce((acc, entry) => {
  acc[entry.id] = entry.meta;
  return acc;
}, {} as Record<string, ToolMeta>);
export const toolLoaders: Record<string, () => Promise<ToolComponentModule>> = entries.reduce(
  (acc, entry) => {
    acc[entry.id] = entry.load;
    return acc;
  },
  {} as Record<string, () => Promise<ToolComponentModule>>
);

export const getToolEntry = (toolId: string): ToolRegistryEntry | undefined => entryMap[toolId];
export const getToolMeta = (toolId: string): ToolMeta | undefined => toolMetaMap[toolId];
