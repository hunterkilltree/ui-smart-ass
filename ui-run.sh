#!/usr/bin/env bash
# ui-run.sh — abstract runner for the Smart AI Assistant Hub frontend.
# Usage:
#   ./ui-run.sh [command] [options]
#
# Commands:
#   dev     (default) start dev server with hot reload
#   build   production build
#   start   build (if needed) and serve production build
#   clean   remove .next and node_modules
#
# Options:
#   -p, --port <port>   port to listen on (default: 3000)
#   -a, --api <url>     backend base URL (default: built-in mock)
#   -h, --help          show this help

set -euo pipefail
cd "$(dirname "$0")"

CMD="dev"
PORT="${PORT:-3000}"
API_URL="${NEXT_PUBLIC_API_BASE_URL:-}"

usage() { sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; }

# --- parse args -------------------------------------------------------------
[[ $# -gt 0 && $1 != -* ]] && { CMD="$1"; shift; }
while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--port) PORT="$2"; shift 2 ;;
    -a|--api)  API_URL="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

# --- preflight ---------------------------------------------------------------
command -v node >/dev/null || { echo "error: node is required (>=18)" >&2; exit 1; }
command -v npm  >/dev/null || { echo "error: npm is required" >&2; exit 1; }

deps() {
  if [[ ! -d node_modules ]] || [[ package.json -nt node_modules ]]; then
    echo "==> Installing dependencies…"
    npm install --no-audit --no-fund
  fi
}

export NEXT_PUBLIC_API_BASE_URL="$API_URL"
[[ -n "$API_URL" ]] && echo "==> API base: $API_URL" || echo "==> API base: built-in mock (/api)"

# --- run ----------------------------------------------------------------------
case "$CMD" in
  dev)
    deps
    echo "==> Dev server on http://localhost:$PORT"
    exec npx next dev -p "$PORT"
    ;;
  build)
    deps
    exec npx next build
    ;;
  start)
    deps
    [[ -d .next ]] || npx next build
    echo "==> Production server on http://localhost:$PORT"
    exec npx next start -p "$PORT"
    ;;
  clean)
    rm -rf .next node_modules
    echo "==> Cleaned .next and node_modules"
    ;;
  *)
    echo "Unknown command: $CMD" >&2; usage; exit 1 ;;
esac
