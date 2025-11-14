# OpenTools 项目文档

## 1. 项目简介

OpenTools 是一个基于 **Vite + React + TypeScript** 的前端工具集合项目，目标是：

- 提供一组常用的小工具（计算、转换、加解密等），统一收纳在一个站点中；
- 每个工具模块独立、低耦合，支持持续扩展；
- 通过 **自动扫描注册系统**，新增工具无需手写 JSON 配置；
- 使用脚本实现「一键初始化项目 / 一键生成新工具 / 一键扩展图标」等能力；
- UI 同时适配 **PC + 移动端**，支持 **暗黑模式**。

## 2. 功能概览

### 2.1 已有 / 规划工具类型（示例）

> 具体实现可按需要逐步补充，这里给出规划方向。

- 计算类
  - 通用计算器
  - 日期差值计算（开始时间 / 结束时间 / 天数）
  - 标题字数统计、文章字数统计
- 编码与安全类
  - 文本哈希计算（MD5 / SHA-1 / SHA-256 等）
  - Base64 编码 / 解码
  - 对称加解密（如 AES）——仅前端演示用途
- 时间与日期类
  - 不同时区时间对照
  - 时间戳与日期互转
  - 倒计时 / 定时器（纯前端）
- 文本与格式处理类
  - 大小写转换
  - JSON 格式化 / 压缩
- 地理与坐标类
  - 经纬度格式互转
  - 经纬度与其他坐标系（如度分秒）互相转换
- 其他
  - UUID 生成
- 随机密码生成
- 项目维护类
  - 依赖差异检测器（快速识别缺失依赖并生成安装命令）

### 2.2 核心特性

- 🧩 **模块化工具系统**：每个工具是独立目录，拥有自己的页面、配置与类型定义；
- 🔎 **自动扫描注册系统**：通过文件约定 + Vite 动态导入自动收集工具信息；
- 🎨 **暗黑模式**：内置主题切换（Light / Dark），状态持久化（localStorage）；
- 📱 **响应式 UI**：首页卡片布局，自动适配 PC / 平板 / 手机；
- ⚙️ **脚本驱动开发**：所有脚本放在 `scripts/` 下，可一键初始化 / 一键生成工具 / 一键更新图标；
- 🧱 **纯工具定位**：仓库仅包含工具、公共模块、脚本与图标系统等模块。

## 3. 技术栈与运行环境

### 3.1 技术栈

- **构建工具**：Vite
- **前端框架**：React
- **语言**：TypeScript
- **样式**：
  - Tailwind CSS（推荐）
  - 可根据需要补充自定义 CSS / UI 组件库
- **包管理**：npm（当前环境：npm 9.2.0，Node.js 18.19.1）

> 注意：部分 Vite / 插件版本的 `engines` 可能提示 Node 版本警告，属于兼容性警告，可在本项目中暂时忽略，不影响脚本执行与开发。

### 3.2 运行环境要求

- Node.js ≥ 18.x
- npm ≥ 9.x
- 浏览器：现代浏览器（Chrome / Edge / Firefox / Safari 的当前/最近版本）

## 4. 目录结构说明（推荐）

```bash
.
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.cjs
├── index.html
├── init-scripts-and-commit-template.sh   # 初始化脚本与 commit 模板
├── scripts/                              # 所有自动化脚本
│   ├── create-tool.sh                    # 新建工具模块模板
│   ├── extend-icons.sh                   # 批量生成 / 扩展工具图标
│   └── install-deps.sh                   # 一键安装依赖
├── src/
│   ├── main.tsx                          # 应用入口
│   ├── styles/tailwind.css               # 全局样式入口
│   ├── app/
│   │   ├── App.tsx
│   │   └── router/
│   │       └── index.tsx
│   ├── layouts/
│   │   └── RootLayout.tsx
│   ├── shared/
│   │   ├── components/                   # 通用 UI 组件（如 ThemeToggle）
│   │   └── theme/                        # 主题上下文 / Hooks
│   ├── assets/
│   │   └── icons/
│   │       ├── index.ts                  # 图标导出入口（自动生成）
│   │       └── tools/*.svg               # 工具 SVG 图标
│   └── features/
│       └── tools/
│           ├── components/               # ToolCard / ToolIcon 等
│           ├── layouts/                  # ToolLayout
│           ├── pages/                    # ToolHub（首页）
│           ├── registry/                 # 自动注册逻辑
│           └── modules/                  # 各工具模块（react 组件 + meta + 逻辑）
└── ...
```
## 5. 工具模块规范

### 5.1 模块目录与命名

- 每个工具是 `src/features/tools/modules/<tool-id>/` 下的独立目录。
- `<tool-id>` 使用 kebab-case，例如 `date-diff`、`hash-calculator`、`geo-coordinate-convert`。

### 5.2 工具基础文件

以 `src/features/tools/modules/hash-calculator/` 为例：

```text
src/features/tools/modules/hash-calculator/
├── index.tsx       # 工具主组件（只负责 UI）
├── logic.ts        # 核心逻辑（纯函数，便于复用与测试）
├── meta.ts         # 工具元数据（被自动注册系统读取）
└── types.ts        # 工具特有类型定义（可选）
```

**`meta.ts` 示例**

```ts
// src/features/tools/modules/hash-calculator/meta.ts
import type { ToolMeta } from "@/features/tools/registry/toolTypes";

export const toolId = "hash-calculator" as const;

export const toolMeta: ToolMeta = {
  id: toolId,
  name: "哈希计算器",
  description: "输入任意文本，计算 MD5 / SHA 系列哈希值。",
  category: "编码与安全",
  route: `/tools/${toolId}`,
  icon: toolId,
  keywords: ["hash", "md5", "sha", "加密", "摘要"],
  order: 10,
};

export default toolMeta;
```

**`logic.ts` 示例**

```ts
// src/features/tools/modules/hash-calculator/logic.ts
export type SupportedHashAlgorithm = "MD5" | "SHA-1" | "SHA-256";

export const initialHashResult = <T extends readonly SupportedHashAlgorithm[]>(algorithms: T) => {
  return algorithms.reduce<Record<T[number], string>>((acc, item) => {
    acc[item] = "";
    return acc;
  }, {} as Record<T[number], string>);
};

export const computeHash = async (algorithm: SupportedHashAlgorithm, message: string): Promise<string> => {
  if (algorithm === "MD5") {
    // 这里可实现纯前端 MD5，或调用 WebAssembly 模块
    throw new Error("请在 UI 中提供 MD5 的具体实现");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
```

**`index.tsx` 示例**

```tsx
// src/features/tools/modules/hash-calculator/index.tsx
import React, { useState } from "react";

export const HashCalculator: React.FC = () => {
  const [input, setInput] = useState("");
  const [md5, setMd5] = useState("");
  const [sha1, setSha1] = useState("");

  const handleCompute = () => {
    // 可根据需要调用内置实现 / 第三方库（注意仅演示用途）
    // setMd5(computeMd5(input));
    // setSha1(computeSha1(input));
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full min-h-[120px] rounded-lg border p-3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入待计算哈希的文本..."
      />
      <button className="rounded-lg border px-4 py-2" onClick={handleCompute}>
        计算
      </button>
      <div className="space-y-2 text-sm">
        <div>
          <div className="font-semibold">MD5</div>
          <div className="break-all">{md5}</div>
        </div>
        <div>
          <div className="font-semibold">SHA-1</div>
          <div className="break-all">{sha1}</div>
        </div>
      </div>
    </div>
  );
};
```

### 5.3 工具公共类型（示例）

```ts
// src/core/registry/toolTypes.ts
export interface ToolMeta {
  id: string; // 唯一标识
  name: string; // 名称（中文）
  description: string; // 简要说明
  category: string; // 分类（如：日期时间 / 编码与安全）
  route: string; // 路由路径
  icon: string; // 图标 key
  keywords?: string[]; // 搜索关键字
  order?: number; // 排序（数字越小越靠前）
  disabled?: boolean; // 是否在 UI 中隐藏
}
```

## 6. 工具自动扫描注册系统

### 6.1 设计目标

- 新增工具时只需创建目录与 `meta.ts`、`logic.ts`、`index.tsx` 文件。
- 无需手动修改 JSON 或中心注册文件。
- 首页卡片、路由、工具列表从统一的 registry 获取。

### 6.2 实现思路（示例）

```ts
// src/core/registry/toolRegistry.ts
import type { ToolMeta } from "./toolTypes";

const metaModules = import.meta.glob<{ default?: ToolMeta; toolMeta?: ToolMeta }>(
  "/src/features/tools/modules/**/meta.ts",
  { eager: true }
);

const componentModules = import.meta.glob("/src/features/tools/modules/**/index.tsx");

export const toolMetaList: ToolMeta[] = Object.values(metaModules)
  .map((mod) => mod.toolMeta ?? mod.default)
  .filter((meta): meta is ToolMeta => Boolean(meta))
  .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

export const toolComponents = componentModules;
```

**约定**：每个 `meta.ts` 必须导出一个 `ToolMeta` 对象，可使用 `export default` 或具名导出。

### 6.3 在首页使用工具列表

```tsx
// src/features/tools/pages/ToolHub.tsx
import React from "react";
import { toolMetaList } from "@/features/tools/registry/toolRegistry";
import { ToolCard } from "@/features/tools/components/ToolCard";

export const ToolHubPage: React.FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {toolMetaList.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};
```

## 7. 工具图标系统

### 7.1 目标

- 为每个工具提供统一样式的图标。
- 支持自动生成 / 扩展图标（如基于模板 SVG 生成变体）。
- 通过脚本批量更新索引文件，减少人工维护。

### 7.2 目录结构

```text
src/assets/icons/
├── index.ts               # 统一导出（scripts/extend-icons.sh 自动生成）
└── tools/
    ├── calculator.svg
    ├── hash-calculator.svg
    ├── date-diff.svg
    └── ...
```

### 7.3 图标使用示例

```ts
// src/assets/icons/index.ts
export const toolIcons = {
  calculator: new URL("./tools/calculator.svg", import.meta.url).href,
  "hash-calculator": new URL("./tools/hash-calculator.svg", import.meta.url).href,
  "date-diff": new URL("./tools/date-diff.svg", import.meta.url).href
} as const;
```

```tsx
// src/features/tools/components/ToolIcon.tsx
import React from "react";
import { toolIcons } from "@/assets/icons";

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className }) => {
  const src = toolIcons[name];
  if (!src) return null;
  return <img src={src} className={className} alt={name} />;
};
```

### 7.4 图标脚本（`extend-icons.sh`）职责

- 根据 `src/features/tools/modules/**/meta.ts` 中的 `icon` 字段检查 SVG 是否存在。
- 可选：从模板复制生成占位图标。
- 更新 `src/assets/icons/index.ts` 中的 `toolIcons` 映射。
- 确保脚本位于 `scripts/extend-icons.sh`，可执行并带注释。

脚本的详细实现可单独维护文档，这里仅定义职责和约定。

## 8. 脚本体系（`scripts/`）

所有脚本统一放在 `scripts/` 目录，并保持可执行与注释完整，便于快速扩展工具或维护依赖。

### 8.1 `create-tool.sh`

- 根据传入的 `tool-id`（kebab-case）与可选显示名快速创建新工具目录。
- 在 `src/features/tools/modules/<tool-id>/` 下生成 `meta.ts` 与 `index.tsx` 模板。
- 自动导出 `toolId`、`toolMeta`，并预填描述 / 分类 / 关键词，可直接被自动注册系统识别。
- 若检测到 `scripts/extend-icons.sh`，完成后会自动刷新图标列表。

```bash
./scripts/create-tool.sh date-diff "日期差计算器"
```

### 8.2 `extend-icons.sh`

- 扫描所有工具目录，保证每个工具在 `src/assets/icons/tools/` 下拥有配套 SVG。
- 缺失时自动生成统一风格的占位图。
- 根据最新 SVG 列表生成 `src/assets/icons/index.ts`，供 React 组件直接引用。

```bash
./scripts/extend-icons.sh
```

### 8.3 `install-deps.sh`

- 在仓库根目录执行 `npm install`，保持锁文件与依赖一致。
- 支持透传任何 npm 参数，适用于本地或 CI 环境。

```bash
./scripts/install-deps.sh --legacy-peer-deps
```

### 8.4 `init-scripts-and-commit-template.sh`

- 保障 `scripts/` 目录存在并赋予执行权限。
- 生成 `.commit-template` 与 `prepare-commit-msg` Git 钩子，统一提交格式。
- 内容聚焦工具仓库自身的开发流程，不再包含 AI 历史或聊天相关描述。

## 9. UI 与主题系统

### 9.1 设计原则

- 保持简洁、清晰、偏工具风，强调可读性与操作效率。
- 统一卡片风格：圆角、适度阴影，可选动画。
- PC / Mobile 自适应：PC 采用多列网格，移动端保持适当的按钮面积与间距。

### 9.2 暗黑模式

- 使用 `ThemeContext` 与 `useTheme` hook 管理主题。
- 结合 `class="dark"` 与 Tailwind 暗色模式能力。
- 通过 `localStorage` 持久化主题选择。

```ts
// src/core/theme/useTheme.ts
import { useContext } from "react";
import { ThemeContext } from "./themeContext";

export const useTheme = () => useContext(ThemeContext);
```

```tsx
// src/components/ThemeToggle.tsx
import React from "react";
import { useTheme } from "@/shared/theme/useTheme";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="rounded-full border px-3 py-1 text-xs" onClick={toggleTheme}>
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};
```

## 10. 开发规范

### 10.1 代码风格

- 全部使用 TypeScript。
- 保持函数与组件职责单一。
- Hook 命名以 `use` 开头。
- 统一导入路径别名（如 `@/app`、`@/features`、`@/shared`）。
- 建议使用 ESLint + Prettier 自动格式化。

### 10.2 组件规范

- UI 组件放在 `src/shared/components/`，避免与某个工具强绑定。
- 工具内部通用逻辑抽离到 `utils.ts`。
- 避免在组件中编写复杂逻辑，优先抽出纯函数。

### 10.3 提交信息规范

- 建议遵循类似 Conventional Commits 的风格：
  - `feat: 增加哈希计算工具`
  - `fix: 修复日期差值计算的边界问题`
  - `chore: 更新依赖与脚本`
- 可在项目中提供 `commit-message-template` 文件，引导统一风格。

## 11. 开发流程示例

### 11.1 初始化项目

1. 在 WSL / 本地终端中进入项目根目录。
2. 运行 `./scripts/install-deps.sh` 完成依赖安装（或直接执行 `npm install`）。
3. 启动开发服务器：`npm run dev`。

### 11.2 新增一个工具

1. 执行脚本：

   ```bash
   ./scripts/create-tool.sh hash-generator
   ```

2. 按提示输入工具名称、描述、分类、图标等信息。
3. 回到项目根目录，启动或刷新 dev 服务器。
4. 在浏览器中访问首页，确认工具卡片出现，并在新工具页面补全业务逻辑与 UI。

### 11.3 更新图标

1. 将新的 SVG 图标放入 `src/assets/icons/tools/`，或仅在 `meta.ts` 中配置 `icon` 字段，由脚本生成占位图标。
2. 执行：

   ```bash
   ./scripts/extend-icons.sh
   ```

3. 确认首页卡片与工具页面的图标展示正常。

### 11.4 使用「依赖差异检测器」

1. 打开浏览器访问首页，点击「依赖差异检测器」工具卡片进入页面。
2. 在左侧输入框粘贴 `package.json` 中的 `dependencies`、`devDependencies`（支持 JSON 或逐行 `name@version` 格式）。
3. 在右侧输入框粘贴实际已安装的依赖列表（可从 `npm ls` 或 lockfile 中复制，亦可留空）。
4. 选择当前项目使用的包管理器（npm / pnpm / Yarn）。
5. 页面会实时展示缺失 / 冗余的依赖列表，并生成对应的安装命令，可一键复制执行。

## 12. 路线图（Roadmap）

- [ ] 完善 `scripts/create-tool.sh`（校验重复 ID、自动生成逻辑模板）
- [ ] 完善 `scripts/extend-icons.sh`（支持批量导入 SVG / 自定义主题）
- [ ] 扩展工具自动扫描注册系统（分类、标签、搜索）
- [ ] 丰富工具库（计算器、日期差值、哈希、时间戳转换等）
- [ ] 引入单元测试（如 Vitest）覆盖关键工具逻辑
- [ ] 打包为静态站点并部署到公开环境（如 GitHub Pages / Vercel）
- [ ] 增加多语言支持（中文 / 英文）

以上文档可作为 OpenTools 的整体说明书、贡献指南与后续扩展依据。后续新增脚本或工具时，只需在对应章节中补充说明即可。
