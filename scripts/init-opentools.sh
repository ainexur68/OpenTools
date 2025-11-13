#!/usr/bin/env bash
# init-opentools.sh
# 初始化 OpenTools Web 前端项目：
# - Vite 4 + React 18 + TypeScript
# - Tailwind CSS 3 + PostCSS
# 兼容 Node 18.x，避免 Vite 7/Node 20+ 的 engine/crypto.hash 问题。

set -euo pipefail

# -------------------------
# 工具函数
# -------------------------

backup_file() {
  local file="$1"
  if [ -f "$file" ]; then
    local backup="${file}.bak.$(date +%Y%m%d-%H%M%S)"
    echo "📦 Backup $file -> $backup"
    mv "$file" "$backup"
  fi
}

# -------------------------
# 路径计算
# -------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP_DIR="${ROOT_DIR}/apps/web"
SRC_DIR="${APP_DIR}/src"

echo "🚀 OpenTools init"
echo "   ROOT_DIR = ${ROOT_DIR}"
echo "   APP_DIR  = ${APP_DIR}"

mkdir -p "${SRC_DIR}"

# -------------------------
# 备份旧文件（如果存在）
# -------------------------

backup_file "${APP_DIR}/package.json"
backup_file "${APP_DIR}/tsconfig.json"
backup_file "${APP_DIR}/vite.config.ts"
backup_file "${APP_DIR}/index.html"
backup_file "${APP_DIR}/postcss.config.cjs"
backup_file "${APP_DIR}/tailwind.config.cjs"
backup_file "${SRC_DIR}/main.tsx"
backup_file "${SRC_DIR}/App.tsx"
backup_file "${SRC_DIR}/index.css"
backup_file "${SRC_DIR}/vite-env.d.ts"

# -------------------------
# 写入 package.json
# -------------------------

cat <<'EOF' > "${APP_DIR}/package.json"
{
  "name": "opentools-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.41",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^4.5.0"
  }
}
EOF

echo "✅ package.json created (Vite 4 + React + TS + Tailwind 3)"

# -------------------------
# 写入 tsconfig.json
# -------------------------

cat <<'EOF' > "${APP_DIR}/tsconfig.json"
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
EOF

echo "✅ tsconfig.json created"

# -------------------------
# 写入 vite.config.ts
# -------------------------

cat <<'EOF' > "${APP_DIR}/vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://v4.vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
EOF

echo "✅ vite.config.ts created"

# -------------------------
# 写入 index.html
# -------------------------

cat <<'EOF' > "${APP_DIR}/index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>OpenTools</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body class="bg-slate-950 text-slate-50">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "✅ index.html created"

# -------------------------
# 写入 Tailwind / PostCSS 配置
# -------------------------

cat <<'EOF' > "${APP_DIR}/tailwind.config.cjs"
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {}
  },
  plugins: []
};
EOF

cat <<'EOF' > "${APP_DIR}/postcss.config.cjs"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
EOF

echo "✅ Tailwind & PostCSS config created"
# -------------------------
# 写入 .gitignore
# -------------------------

backup_file "${APP_DIR}/.gitignore"

cat <<'EOF' > "${APP_DIR}/.gitignore"
# ---- Node ----
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
*.log

# ---- Vite ----
dist/
.vite/
vite.config.ts.timestamp*
*.tsbuildinfo

# ---- React / TS ----
*.DS_Store
*.local
*.bak.*
*.swp
*.tmp
*.temp

# ---- Env ----
.env
.env.*
!.env.example

# ---- Editor ----
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln

# ---- OpenTools Specific ----
# 自动扫描生成的工具元数据（未来保留）
tools/.generated/
apps/**/cache/
apps/**/.tool-cache/
EOF

echo "✅ .gitignore created"

# -------------------------
# 写入 .npmignore
# -------------------------

backup_file "${APP_DIR}/.npmignore"

cat <<'EOF' > "${APP_DIR}/.npmignore"
# 不发布源代码，只发布构建产物
src/
scprit/
scripts/
tests/
.vite/
node_modules/
*.log
*.map
*.bak.*

# 保留 dist（构建产物）
!dist/

# 忽略自动生成缓存
tools/.generated/
apps/**/cache/
apps/**/.tool-cache/

# 忽略环境变量
.env
.env.*
EOF

echo "✅ .npmignore created"

# -------------------------
# 写入 src/index.css
# -------------------------

cat <<'EOF' > "${SRC_DIR}/index.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
EOF

echo "✅ src/index.css created"

# -------------------------
# 写入 src/vite-env.d.ts
# -------------------------

cat <<'EOF' > "${SRC_DIR}/vite-env.d.ts"
/// <reference types="vite/client" />
EOF

echo "✅ src/vite-env.d.ts created"

# -------------------------
# 写入 src/App.tsx
# -------------------------

cat <<'EOF' > "${SRC_DIR}/App.tsx"
import React from "react";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-xl mx-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-2">OpenTools</h1>
        <p className="text-sm text-slate-300 mb-4">
          Vite 4 + React + TypeScript + Tailwind 3 scaffold, compatible with Node 18.x.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm">
            <div className="font-medium mb-1">Dev</div>
            <code className="text-xs text-slate-300">npm run dev</code>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm">
            <div className="font-medium mb-1">Build</div>
            <code className="text-xs text-slate-300">npm run build</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
EOF

echo "✅ src/App.tsx created"

# -------------------------
# 写入 src/main.tsx
# -------------------------

cat <<'EOF' > "${SRC_DIR}/main.tsx"
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo "✅ src/main.tsx created"

# -------------------------
# 安装依赖
# -------------------------

cd "${APP_DIR}"
echo "📦 Installing dependencies (npm install)..."
npm install

echo
echo "🎉 OpenTools web initialized successfully."
echo "👉 Next steps:"
echo "   cd apps/web"
echo "   npm run dev"
echo
echo "如果在 WSL 中运行，请确保保存脚本时使用 LF 行尾（避免 bash\\r 问题）。"
