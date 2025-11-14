# OpenTools

OpenTools 是一个纯前端的小工具仓库，专注于「计算 / 转换 / 加解密 / 日期 / 环境诊断」等常用场景。仓库采用 **Vite + React + TypeScript + Tailwind CSS** 技术栈，所有工具都通过自动注册系统发现，不再混入聊天或 AI 历史模块，易于维护与扩展。

---

## ✨ 特性速览

- **完全前端化**：只包含工具、公共组件、脚本与图标，不引入后端或聊天模块。
- **自动注册系统**：新增工具仅需放入 `src/features/tools/modules/<tool-id>`，即刻出现在路由与首页。
- **脚本驱动**：`scripts/` 目录提供 create-tool、extend-icons、install-deps 等自动化脚本，保持结构一致。
- **Dark/Light 主题**：共享 `ThemeProvider` + Tailwind 方案，已适配 PC & 移动端。
- **易于测试与部署**：使用 Vitest + Testing Library，`npm run build` 直接输出静态产物。

---

## ⚙️ 技术栈

| 分类 | 说明 |
| --- | --- |
| 构建 | [Vite 5](https://vitejs.dev/) + ESBuild |
| UI | React 18、React Router 6、Tailwind CSS 3 |
| 语言 | TypeScript 5（`moduleResolution: bundler`） |
| 测试 | Vitest、@testing-library/react |
| 包管理 | npm 9+ / Node.js 18+ |

---

## 🚀 快速开始

```bash
# 1. 安装依赖（可透传参数给 npm）
./scripts/install-deps.sh

# 2. 启动开发服务器
npm run dev

# 3. 生产构建（含类型检查）
npm run build

# 4. 类型检查 & 单测
npm run typecheck
npm run test
```

---

## 🗂️ 目录结构

```
.
├── package.json                     # dev/build/test 脚本
├── vite.config.ts                   # Vite + Vitest 配置
├── tailwind.config.ts               # Tailwind 扫描与主题
├── tsconfig.json                    # Alias: @ / @features / @shared / ...
├── scripts/                         # 自动化脚本（默认可执行）
│   ├── create-tool.sh               # 创建工具模板
│   ├── extend-icons.sh              # 刷新工具图标 & 映射
│   └── install-deps.sh              # 一键安装依赖
├── src/
│   ├── main.tsx                     # React 入口
│   ├── styles/tailwind.css          # 全局样式
│   ├── app/
│   │   ├── App.tsx
│   │   └── router/index.tsx
│   ├── layouts/RootLayout.tsx
│   ├── shared/                      # ThemeProvider / 公共组件
│   ├── assets/icons/                # scripts/extend-icons.sh 生成
│   └── features/tools/
│       ├── components/              # ToolCard / ToolIcon
│       ├── layouts/ToolLayout.tsx
│       ├── pages/ToolHub.tsx        # 首页
│       ├── registry/                # toolRegistry + types
│       └── modules/<tool-id>/       # 每个工具的 meta/index/logic
└── init-scripts-and-commit-template.sh
```

---

## 🧩 工具模块规范

每个工具位于 `src/features/tools/modules/<tool-id>/`，推荐结构：

```
<tool-id>/
├── meta.ts     # ToolMeta 定义（必需，自动注册依赖）
├── index.tsx   # React 组件（UI）
├── logic.ts    # 纯逻辑函数 / hooks（可选）
└── types.ts    # 私有类型（可选）
```

示例 `meta.ts`：

```ts
import type { ToolMeta } from "@/features/tools/registry/toolTypes";

export const toolId = "hash-calculator" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "哈希计算器",
  description: "计算 MD5 / SHA 系列摘要。",
  category: "编码与安全",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["hash", "md5", "sha"],
  order: 12
};

export default toolMeta;
```

核心类型 `ToolMeta`：

```ts
export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  route: string;
  icon: string;
  keywords?: readonly string[];
  order?: number;
  disabled?: boolean;
}
```

---

## 🔄 自动注册系统

- `toolRegistry.ts` 通过 `import.meta.glob("../modules/**/meta.ts", { eager: true })` 收集所有 `toolMeta`。
- 对应组件通过 `import.meta.glob("../modules/**/index.tsx")` 懒加载，自动生成 `toolLoaders`。
- `ToolHubPage` 使用 `toolMetaList` 渲染卡片；`ToolLayout` 根据 `toolId` 调用 `getToolEntry`。
- 默认路由：`/tools/<tool-id>`，可在 `meta.route` 自定义。

新增工具流程：

```bash
./scripts/create-tool.sh uuid-generator "UUID 生成器"
# → src/features/tools/modules/uuid-generator/* 自动创建
# → 若存在 scripts/extend-icons.sh，会自动刷新图标映射
```

---

## 🎨 图标系统

```
src/assets/icons/
├── tools/<tool-id>.svg      # 每个工具独立 SVG
└── index.ts                 # scripts/extend-icons.sh 自动生成
```

`extend-icons.sh` 负责：

1. 扫描 `src/features/tools/modules/**`，确保每个 `toolId` 拥有 SVG（缺失则生成渐变占位图）。
2. 重写 `src/assets/icons/index.ts`，导出 `toolIcons`、`getToolIcon`。
3. 运行后，`ToolIcon` 组件即可直接展示图标；若缺失则显示首字母占位。

---

## 🛠️ 脚本一览

| 脚本 | 说明 |
| --- | --- |
| `scripts/create-tool.sh` | 生成工具模板（meta + 组件），自动提示更新描述与关键词。 |
| `scripts/extend-icons.sh` | 生成占位 SVG，刷新 `src/assets/icons/index.ts` 映射。 |
| `scripts/install-deps.sh` | 在仓库根目录执行 `npm install`，支持透传额外参数。 |
| `init-scripts-and-commit-template.sh` | 初始化 `scripts/` + `.commit-template` + Git hook。 |

所有脚本默认具备执行权限，必要时可 `chmod +x scripts/*.sh`。

---

## 🧪 开发与测试规范

- **组件**：共享 UI 放在 `src/shared/components`，工具特定组件放在 `src/features/tools/components`。
- **状态管理**：优先使用 React hooks；跨工具的状态集中到 `shared/`。
- **样式**：Tailwind 优先，复杂场景可抽离到 `styles/tailwind.css`。
- **提交**：建议遵循 Conventional Commits，`.commit-template` 已提供占位。
- **测试**：业务逻辑放在 `logic.ts` 时更易被 `vitest` 覆盖。

---

## 🗺️ 路线图

- [ ] 扩展 `scripts/create-tool.sh`：校验重复 ID，提供逻辑/测试模板。
- [ ] 增强工具分类/搜索体验（按 tags 过滤）。
- [ ] 补充更多工具（时间戳、Base64、依赖诊断等）。
- [ ] 引入 CI 任务：lint / typecheck / test / build。
- [ ] 支持多语言与 PWA 安装。

欢迎通过 Issues / PR 参与共建，一切围绕「纯前端工具集合」持续打磨。 👩‍💻👨‍💻
