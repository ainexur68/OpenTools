# OpenTools 🧰

> 「把常用的小工具都装进一个干净、可扩展的前端站点」

> ℹ️ *可在 `apps/web/public/` 内放置产品截图或横幅图片，并在此 README 中引用展示。*

---

## ✨ 项目概览

OpenTools 是一个基于 **Vite + React + TypeScript** 构建的前端工具集平台，旨在提供一个可持续扩展、脚本驱动的工具生态：

- 🧩 **模块化工具体系**：每个工具拥有独立目录与元信息，低耦合易维护；
- 🔍 **自动扫描注册**：通过约定式目录 + Vite 动态导入，自动收集并渲染工具列表；
- ⚙️ **脚本驱动开发**：提供一键初始化、生成工具、扩展图标等脚本；
- 🌓 **主题与适配**：支持 Light/Dark 主题切换，移动端优先的响应式体验；
- 📚 **AI 历史档案**：计划记录项目从 0 到 1 的智能助手协作过程，形成可回溯的知识库。

---

## 🗺️ 功能导航

| 分类 | 已有 / 规划功能 | 描述 |
| ---- | --------------- | ---- |
| 🧮 计算类 | 通用计算器 · 日期差值计算 · 字数统计 | 覆盖常见的日常计算场景 |
| 🔐 编码安全 | 哈希计算（MD5/SHA）· Base64 · 对称加解密（演示） | 快速处理数据编码与安全需求 |
| ⏱️ 时间日期 | 时间戳互转 · 多时区对照 · 倒计时 | 便捷掌握时间信息 |
| ✍️ 文本处理 | 大小写转换 · JSON 格式化/压缩 | 日常开发辅助工具 |
| 🌍 地理坐标 | 经纬度互转 · 度分秒转换 | 地理信息处理小帮手 |
| 🎲 随机生成 | UUID · 随机密码 | 快速生成唯一标识与安全口令 |
| 🧪 项目维护 | 依赖差异检测器 · 配置对比 | 协助开发流程管理 |
| 🚧 未来展望 | 数据可视化工具箱 · Git 工作流助手 · API Mock 平台 | 保持开放，欢迎社区共建 |

---

## 🏗️ 技术栈

| 领域 | 选择 |
| ---- | ---- |
| 构建工具 | Vite |
| 前端框架 | React + React Router |
| 语言 | TypeScript |
| UI & 样式 | Tailwind CSS（推荐）· CSS Modules · Icon 系统 |
| 包管理 | npm（Node.js ≥ 18.x，npm ≥ 9.x） |
| 测试（规划） | Vitest · Testing Library |
| 自动化脚本 | Bash（位于 `script/` 目录） |

> 💡 兼容现代浏览器（Chrome / Edge / Firefox / Safari 最新版本）。

---

## 📂 目录速览

```bash
OpenTools/
├── apps/
│   └── web/                # Vite + React 主体项目
│       ├── src/
│       │   ├── components/ # UI 组件（主题切换、工具卡片等）
│       │   ├── core/       # 主题上下文、工具注册等核心逻辑
│       │   ├── icons/      # 工具图标资源
│       │   ├── layout/     # 页面布局
│       │   ├── pages/      # 页面入口（首页、工具页）
│       │   └── tools/      # 实际工具实现
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── script/                 # 一键化脚本集合
│   ├── init-opentools.sh
│   ├── create-tool.sh
│   ├── extend-opentools.sh
│   └── extend-icons.sh
├── scripts/                # 历史脚本归档
├── src/                    # 可共享的工具系统源码（若多端复用）
├── init-scripts-and-commit-template.sh
└── README.md
```

---

## 🚀 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-name/OpenTools.git
   cd OpenTools/apps/web
   ```
2. **安装依赖**
   ```bash
   npm install
   ```
3. **启动开发环境**
   ```bash
   npm run dev
   ```
4. **访问应用**：浏览器打开 `http://localhost:5173`，即可体验当前工具集合。

> 若首次启动失败，请确认 Node.js 版本 ≥ 18 且已安装 npm 9.x 以上版本。

---

## 🛠️ 脚本工具箱

| 脚本 | 作用 | 使用示例 |
| ---- | ---- | -------- |
| `script/init-opentools.sh` | 初始化项目依赖、生成配置 | `./script/init-opentools.sh` |
| `script/create-tool.sh` | 生成新工具模板及元信息 | `./script/create-tool.sh hash-generator` |
| `script/extend-icons.sh` | 批量生成/更新工具图标 | `./script/extend-icons.sh` |
| `script/extend-opentools.sh` | 扩展主题/首页布局等脚手架能力 | `./script/extend-opentools.sh` |

> ✅ 建议在脚本执行后运行 `npm run lint` 或 `npm run test`（未来提供）以确保质量。

---

## 🧭 开发指引

- 使用 TypeScript 编写所有业务逻辑与组件；
- Hook 命名以 `use` 开头，确保可读性与复用性；
- 公共组件存放于 `src/components/`，工具内部复用逻辑建议抽离到 `utils.ts`；
- 统一使用路径别名（如 `@/core`、`@/tools`），配合 `tsconfig.json` 配置；
- 推荐启用 ESLint + Prettier 实现自动化格式化。

---

## 🔭 路线图

- [ ] 完成基础主题系统与工具卡片 UI
- [ ] 建立完善的工具自动注册体系
- [ ] 首批上线：计算器、日期差值、哈希计算、时间戳转换等核心工具
- [ ] 引入 Vitest + Testing Library，覆盖关键逻辑单元测试
- [ ] 建设 `ai-history/` 文档，记录智能助手协作过程
- [ ] 支持多语言（中文 / 英文）与 PWA 离线体验
- [ ] 提供可选的服务端扩展（云函数 / Edge Function）以承载重计算工具
- [ ] 构建部署流程（GitHub Actions + GitHub Pages / Vercel）

欢迎通过 Issue 或 Pull Request 提出新的工具需求，路线图将根据社区反馈滚动更新。

---

## 🤝 贡献指南

1. Fork 仓库并创建新分支：`git checkout -b feat/awesome-tool`
2. 完成开发与测试，确保 `npm run build` / `npm run lint` 通过（测试脚本规划中）
3. 使用建议的提交格式：`feat: add awesome tool`
4. 提交 Pull Request，描述变更内容与测试情况

> 📬 如有想法但暂未动手，可提交 Issue 描述需求，维护者会评估优先级。

---

## 📢 社区与展望

- 🎯 **目标**：打造一个自维护、持续扩展的开源工具集合
- 🧑‍🤝‍🧑 **参与**：欢迎任何形式的贡献——代码、设计、脚本、文档
- 🧭 **未来**：计划提供更多自动化能力（CLI、Git Hooks、AI 辅助脚本），以及多端适配（桌面端、移动端 WebView）
- 📸 **展示**：当项目上线后，欢迎提交你的部署链接与截图，我们会在 README 中展示优秀案例

如果你对这个项目感兴趣，请点击 ⭐ Star 支持我们，让 OpenTools 成为开发者与创作者的常备工具箱！

---

**License**

本项目基于 [MIT License](./LICENSE) 开源，可自由使用与二次开发。
