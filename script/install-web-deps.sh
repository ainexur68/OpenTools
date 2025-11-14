#!/usr/bin/env bash
# 安装或更新 apps/web 的依赖，默认安装 package.json 中声明的全部依赖。
# 如果需要只更新单个依赖，可传入附加参数，例如：
#   ./script/install-web-deps.sh react-router-dom@^6.30.2 --package-lock-only
# 所有传入参数会原样透传给 npm。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR%/script}"
WEB_APP_DIR="${PROJECT_ROOT}/apps/web"

if [[ ! -d "${WEB_APP_DIR}" ]]; then
  echo "未找到 apps/web 目录，请确认在项目根目录执行脚本。" >&2
  exit 1
fi

npm install --prefix "${WEB_APP_DIR}" "$@"
