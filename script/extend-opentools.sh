#!/usr/bin/env bash
# script/extend-opentools.sh
# 为 OpenTools apps/web 追加：
# - 主题切换（暗黑 / 亮色）
# - 首页卡片式 UI
#
# 仅改写 src/App.tsx，不安装依赖。
# 兼容 Node 18.19.1 / npm 9.2.0。

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

echo "🚀 OpenTools extend (theme + home cards)"
echo "   ROOT_DIR = ${ROOT_DIR}"
echo "   APP_DIR  = ${APP_DIR}"
echo

if [ ! -d "${APP_DIR}" ]; then
  echo "❌ apps/web not found. Please run your init-opentools script first." >&2
  exit 1
fi

mkdir -p "${SRC_DIR}"

# -------------------------
# 备份旧 App.tsx
# -------------------------

backup_file "${SRC_DIR}/App.tsx"

# -------------------------
# 写入新的 App.tsx
# -------------------------

cat <<'EOF' > "${SRC_DIR}/App.tsx"
import React, { useEffect, useState } from "react";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem("ot-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem("ot-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const pageBg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
  const borderColor = isDark ? "border-slate-800/60" : "border-slate-200";
  const headerHint = isDark ? "text-slate-400" : "text-slate-500";
  const footerBorder = isDark ? "border-slate-800/60" : "border-slate-200";
  const footerText = isDark ? "text-slate-500" : "text-slate-500";

  const buttonBase =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition";
  const buttonStyle = isDark
    ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-100";

  const cardBase =
    "rounded-2xl px-4 py-4 shadow-sm hover:shadow-md transition-shadow text-sm flex flex-col items-start justify-between";
  const cardStyle = isDark
    ? "border border-slate-800/60 bg-slate-900/80 text-slate-100"
    : "border border-slate-200 bg-white text-slate-900";

  const badgeBase =
    "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide";
  const badgeStyle = isDark
    ? "bg-slate-700/60 text-slate-50"
    : "bg-slate-100 text-slate-700";

  const cards: Array<{ title: string; desc: string; badge: string }> = [
    {
      title: "快速计算器",
      desc: "基础四则运算与常用换算，支持一键复制结果。",
      badge: "基础工具"
    },
    {
      title: "哈希 & 加密",
      desc: "MD5 / SHA 系列哈希与简单加解密，方便调试接口签名。",
      badge: "开发调试"
    },
    {
      title: "日期时间助手",
      desc: "时间差计算、时间戳转换、常用格式一键生成。",
      badge: "效率增强"
    },
    {
      title: "地理坐标转换",
      desc: "经纬度与多种坐标系之间转换，适配地图与 GIS 场景。",
      badge: "GIS"
    },
    {
      title: "文本工具箱",
      desc: "大小写转换、去空格、编码转换等常见文本操作。",
      badge: "文本处理"
    },
    {
      title: "更多工具（预留）",
      desc: "为后续新增 OpenTools 模块保留占位卡片。",
      badge: "即将上线"
    }
  ];

  return (
    <div className={`min-h-screen ${pageBg} transition-colors`}>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">OpenTools</h1>
            <p className={`mt-1 text-xs sm:text-sm ${headerHint}`}>
              一站式小工具集合 · 支持主题切换
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`${buttonBase} ${buttonStyle}`}
          >
            <span className="text-base">{isDark ? "🌙" : "☀️"}</span>
            <span>{isDark ? "暗色模式" : "亮色模式"}</span>
          </button>
        </header>

        <main className="flex-1">
          <section className="mb-6">
            <h2 className={`mb-2 text-sm font-medium ${headerHint}`}>常用工具</h2>
            <p className={`mb-4 text-xs sm:text-sm ${headerHint}`}>
              点击卡片即可进入对应工具模块，当前为 UI 占位与导航示例，可后续替换为真实路由。
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  className={`${cardBase} ${cardStyle}`}
                >
                  <div className="mb-2 flex w-full items-start justify-between gap-2">
                    <div className="text-sm font-medium">{card.title}</div>
                    <span className={`${badgeBase} ${badgeStyle}`}>{card.badge}</span>
                  </div>
                  <p className="text-xs opacity-90 text-left">{card.desc}</p>
                </button>
              ))}
            </div>
          </section>
        </main>

        <footer
          className={`mt-8 border-t pt-4 text-xs ${footerBorder} ${footerText}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>OpenTools · 前端模板 · Vite 4 + React + TS + Tailwind 3</span>
            <span className={headerHint}>
              当前主题：{isDark ? "暗色" : "亮色"}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
EOF

echo
echo "✅ src/App.tsx updated with theme toggle & home cards."
echo "👉 Next steps:"
echo "   cd apps/web"
echo "   npm run dev"
echo
