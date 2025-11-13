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

### 2.2 核心特性

- 🧩 **模块化工具系统**：每个工具是独立目录，拥有自己的页面、配置与类型定义；
- 🔎 **自动扫描注册系统**：通过文件约定 + Vite 动态导入自动收集工具信息；
- 🎨 **暗黑模式**：内置主题切换（Light / Dark），状态持久化（localStorage）；
- 📱 **响应式 UI**：首页卡片布局，自动适配 PC / 平板 / 手机；
- ⚙️ **脚本驱动开发**：所有脚本放在 `script/` 下，可一键初始化 / 一键生成工具 / 一键更新图标；
- 🧠 **AI 历史系统规划**：将项目的设计对话、脚本生成过程归档到仓库中，作为项目的独特亮点。

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
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .editorconfig
├── .gitignore
├── .npmrc
├── script/                         # 所有脚本统一放在此目录
│   ├── init-opentools.sh           # 初始化 OpenTools 项目
│   ├── extend-opentools.sh         # 扩展主题 / 首页 UI 卡片等
│   ├── create-tool.sh              # 新建工具模块的模板脚本
│   ├── extend-icons.sh             # 自动生成 / 扩展工具图标
│   ├── init-scripts.sh             # 脚本目录初始化（可选）
│   └── ...                         # 其他辅助脚本
├── scripts/                        # （可选）历史脚本文本归档，与 script/ 区分
├── src/
│   ├── main.tsx                    # 应用入口
│   ├── App.tsx                     # 路由与布局
│   ├── router/                     # 路由配置
│   │   └── index.tsx
│   ├── layout/
│   │   ├── RootLayout.tsx          # 顶层布局（含主题切换等）
│   │   └── ToolLayout.tsx          # 工具页面布局
│   ├── components/
│   │   ├── ThemeToggle.tsx         # 主题切换按钮
│   │   ├── ToolCard.tsx            # 首页工具卡片
│   │   ├── ToolIcon.tsx            # 工具图标组件
│   │   └── ...
│   ├── tools/                      # 所有工具模块的根目录
│   │   ├── calculator/             # 示例：计算器工具
│   │   │   ├── index.tsx           # 工具主组件
│   │   │   ├── config.ts           # 工具元数据（id、名称、图标等）
│   │   │   ├── types.ts            # 类型定义（可选）
│   │   │   └── utils.ts            # 工具内部逻辑（可选）
│   │   ├── hash/                   # 示例：哈希计算工具
│   │   └── ...
│   ├── core/
│   │   ├── registry/               # 工具自动注册相关
│   │   │   ├── toolRegistry.ts     # 自动扫描 + 注册逻辑
│   │   │   └── toolTypes.ts        # 工具公共类型定义
│   │   ├── theme/                  # 主题切换逻辑
│   │   │   ├── themeContext.tsx
│   │   │   └── useTheme.ts
│   │   └── store/                  # 全局状态（如需要）
│   ├── icons/                      # 统一的图标资源目录
│   │   ├── index.ts                # 图标导出入口
│   │   └── tool/                   # 每个工具使用的图标文件（SVG/TSX）
│   └── styles/
│       └── global.css              # 全局样式（含 Tailwind 基础引入）
└── ...
```
5. 工具模块规范
5.1 模块目录与命名

每个工具一个独立目录，位于 src/tools/<tool-id>/

<tool-id> 使用 kebab-case，例如：

date-diff

hash-generator

geo-coordinate-convert

5.2 工具基础文件

以 src/tools/hash-generator/ 为例：

src/tools/hash-generator/
├── index.tsx       # 工具主组件
├── config.ts       # 工具元数据
├── types.ts        # 工具特有类型定义（可选）
└── utils.ts        # 工具内部逻辑（可选）

config.ts（示例）
// src/tools/hash-generator/config.ts
import type { ToolMeta } from "@/core/registry/toolTypes";

export const hashGeneratorMeta: ToolMeta = {
  id: "hash-generator",
  name: "哈希计算器",
  description: "输入任意文本，计算 MD5 / SHA 系列哈希值。",
  category: "编码与安全",
  route: "/tools/hash-generator",
  icon: "hash", // 对应图标系统中的 key
  keywords: ["hash", "md5", "sha", "加密", "摘要"],
  order: 10,
};

index.tsx（示例）
// src/tools/hash-generator/index.tsx
import React, { useState } from "react";

export const HashGenerator: React.FC = () => {
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

5.3 工具公共类型（示例）
// src/core/registry/toolTypes.ts
export interface ToolMeta {
  id: string;               // 唯一标识
  name: string;             // 名称（中文）
  description: string;      // 简要说明
  category: string;         // 分类（如：日期时间 / 编码与安全）
  route: string;            // 路由路径
  icon: string;             // 图标 key
  keywords?: string[];      // 搜索关键字
  order?: number;           // 排序（数字越小越靠前）
  disabled?: boolean;       // 是否在 UI 中隐藏
}

6. 工具自动扫描注册系统
6.1 设计目标

新增工具时：

只需新建目录 + config.ts + index.tsx；

不需要手动修改任何 JSON 或中心注册文件；

首页卡片、路由、工具列表，均从统一的 registry 获取。

6.2 实现思路（示例）
// src/core/registry/toolRegistry.ts
import type { ToolMeta } from "./toolTypes";

const metaModules = import.meta.glob<{
  readonly [key: string]: unknown;
}>("/src/tools/**/config.ts", { eager: true });

const componentModules = import.meta.glob("/src/tools/**/index.tsx");

export const toolMetaList: ToolMeta[] = Object.values(metaModules)
  .map((mod: any) => {
    // 每个 config.ts 需要导出一个 `xxxMeta` 对象
    const meta: ToolMeta | undefined =
      mod.default || Object.values(mod).find((v) => v && v.id);
    return meta;
  })
  .filter(Boolean)
  .sort((a: any, b: any) => (a.order ?? 9999) - (b.order ?? 9999));

export const toolComponents = componentModules;


约定：

每个 config.ts 必须导出一个 ToolMeta 对象（可使用 export default，也可具名导出后在上面逻辑中识别）。

6.3 在首页使用工具列表
// src/pages/Home.tsx
import React from "react";
import { toolMetaList } from "@/core/registry/toolRegistry";
import { ToolCard } from "@/components/ToolCard";

export const Home: React.FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {toolMetaList.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};

7. 工具图标系统
7.1 目标

每个工具对应一个统一样式的图标；

图标可自动生成 / 扩展（如从模版 SVG 生成不同颜色 / 变体）；

通过脚本 批量更新 图标索引文件，避免人工维护。

7.2 目录结构
src/icons/
├── index.ts               # 统一导出
├── tool/
│   ├── calculator.svg
│   ├── hash.svg
│   ├── date-diff.svg
│   └── ...
└── ...

7.3 图标使用示例
// src/icons/index.ts
export const toolIcons: Record<string, string> = {
  calculator: "/src/icons/tool/calculator.svg",
  hash: "/src/icons/tool/hash.svg",
  "date-diff": "/src/icons/tool/date-diff.svg",
  // ...
};

// src/components/ToolIcon.tsx
import React from "react";
import { toolIcons } from "@/icons";

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className }) => {
  const src = toolIcons[name];
  if (!src) return null;
  return <img src={src} className={className} alt={name} />;
};

7.4 图标脚本（extend-icons.sh 的职责）

根据 src/tools/**/config.ts 中的 icon 字段：

检查对应 SVG 是否存在；

可选：复制基础模板 SVG 生成占位图标；

更新 src/icons/index.ts 中的 toolIcons 映射；

确保脚本位于 script/extend-icons.sh，可执行，带注释。

脚本具体实现可在后续单独维护文档，这里只定义职责和约定。

8. 脚本体系（script/）

所有脚本统一放置在 script/ 目录，并保证有执行权限与必要注释。

8.1 init-opentools.sh

功能：

初始化一个全新的 OpenTools 项目；

创建项目目录结构；

调用 npm create vite@latest 或等效操作；

安装依赖（React / TS / Tailwind 等）；

补全 .gitignore、.editorconfig 等基础文件；

兼容当前 Node 18 / npm 9 环境，避免使用过于严格的 engine 限制。

使用示例：

cd script
./init-opentools.sh my-open-tools

8.2 extend-opentools.sh

功能：

在已存在的 Vite + React + TS 项目上：

注入主题系统（context + hook + UI 按钮）；

创建首页卡片布局组件；

初始化 src/core/registry/、src/tools/ 等目录；

更新 App.tsx / 路由结构以接入工具首页。

使用示例：

cd script
./extend-opentools.sh

8.3 create-tool.sh（加强版）

功能：

通过命令行交互 / 参数自动创建新工具；

输入：工具 ID、中文名称、描述、分类、图标 key 等；

在 src/tools/<id>/ 下生成：

index.tsx

config.ts

types.ts（可选）

utils.ts（可选）

自动触发图标脚本（可选）；

可选择生成示例代码（基础表单 / 输入输出 UI）。

使用示例：

cd script
./create-tool.sh hash-generator

8.4 extend-icons.sh

功能：

扫描所有工具的 config.ts；

按 icon 字段补全 SVG 文件与 src/icons/index.ts；

可生成占位图标（统一样式、颜色可配）。

使用示例：

cd script
./extend-icons.sh

8.5 init-scripts.sh（可选）

功能：

初始化 script/ 目录自身：

生成脚本文件模板（带 shebang + 注释）；

设置执行权限；

创建基础 README 或使用说明。

9. UI 与主题系统
9.1 设计原则

简洁、清晰、偏工具风，强调可读性与操作效率；

统一卡片风格：圆角、适当阴影、动画可选；

PC / Mobile 自适应：

PC：多列网格布局；

Mobile：单列 / 双列，保持按钮面积与间距。

9.2 暗黑模式

推荐实现：

使用 ThemeContext 与 useTheme hook；

使用 class="dark" + Tailwind 的暗色模式；

将当前主题存储在 localStorage 中，刷新页面保持选择。

简要示例：

// src/core/theme/useTheme.ts
import { useContext } from "react";
import { ThemeContext } from "./themeContext";

export const useTheme = () => useContext(ThemeContext);

// src/components/ThemeToggle.tsx
import React from "react";
import { useTheme } from "@/core/theme/useTheme";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="rounded-full border px-3 py-1 text-xs" onClick={toggleTheme}>
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

10. 开发规范
10.1 代码风格

全部使用 TypeScript；

保持函数与组件的职责单一；

Hook 命名以 use 开头；

统一导入路径别名（如 @/core, @/tools 等）；

建议使用 ESLint + Prettier 自动格式化。

10.2 组件规范

UI 组件放在 src/components/，避免与某个工具强绑定；

工具内部通用逻辑抽到 utils.ts；

避免在组件中写复杂逻辑，优先抽出纯函数。

10.3 提交信息规范

建议使用类似 Conventional Commits 风格：

feat: 增加哈希计算工具

fix: 修复日期差值计算的边界问题

chore: 更新依赖与脚本

可在项目中提供 commit-message-template 文件，引导统一风格。

11. 开发流程示例
11.1 初始化项目

在 WSL / 本地终端中进入目标目录；

运行 script/init-opentools.sh；

安装依赖（若脚本未自动处理）：

npm install


启动开发服务器：

npm run dev

11.2 新增一个工具

执行脚本：

cd script
./create-tool.sh hash-generator


按脚本提示输入工具名称、描述、分类、图标等；

回到项目根目录，启动 / 刷新 dev 服务器；

在浏览器中访问首页，确认工具卡片出现；

在新工具页面中补全业务逻辑与 UI。

11.3 更新图标

将新的 SVG 图标放入 src/icons/tool/；

或仅配置 config.ts 中的 icon，交给脚本生成占位图标；

执行：

cd script
./extend-icons.sh


确认首页卡片与工具页面的图标展示正常。

12. AI 历史系统（规划）
12.1 设计意图

将项目的设计过程、脚本生成对话等内容存档；

作为 OpenTools 的一部分展示：「这个项目从 0 到 1 的 AI 辅助历史」；

提升项目独特性与可读性，对开源社区友好。

12.2 推荐结构
ai-history/
├── 2025-11-13-init-opentools.md
├── 2025-11-13-create-tool-script.md
├── 2025-11-14-extend-icons.md
└── ...


内容可包含：

对话摘要（不必逐字粘贴）；

关键决策点与备选方案；

最终脚本 / 代码片段。

13. 路线图（Roadmap）

可根据项目进度逐步勾选：

 完成基础项目初始化脚本 init-opentools.sh

 完成主题系统与首页卡片 UI

 完成工具自动扫描注册系统

 完成 create-tool.sh 加强版脚本（支持自动生成配置与示例代码）

 完成图标生成脚本 extend-icons.sh

 实现首批核心工具（计算器、日期差值、哈希计算、时间戳转换等）

 引入单元测试（如 Vitest）覆盖关键工具逻辑

 完成 AI 历史系统（ai-history 目录与展示页面）

 打包为静态站点并部署到公开环境（如 GitHub Pages / Vercel）

 增加多语言支持（中文 / 英文）

以上文档可作为 OpenTools 项目的整体说明书、贡献指南与后续扩展依据，后续新增脚本或工具时，只需在对应章节中补充说明即可。