#!/usr/bin/env bash
# 安装或更新 OpenTools 前端依赖，默认安装 package.json 中声明的全部依赖。
# 所有传入参数会原样透传给 npm，例如：
#   ./scripts/install-deps.sh react@latest

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_ROOT}"
npm install "$@"
