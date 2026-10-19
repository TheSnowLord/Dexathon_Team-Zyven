#!/usr/bin/env bash
set -e

# ACE Opportunity Compass — Unified Development Launcher
# DEXATHON 2026 · Team Zyven

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🧭 Starting ACE Opportunity Compass development environment..."
echo "📁 Root Directory: $ROOT_DIR"

cleanup() {
    echo ""
    echo "🛑 Shutting down backend and frontend services..."
    kill "$API_PID" "$WEB_PID" 2>/dev/null || true
    wait "$API_PID" 2>/dev/null || true
    wait "$WEB_PID" 2>/dev/null || true
    echo "👋 Shutdown complete."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Start Go Backend
echo "⚡ Starting Go Fiber API server on http://127.0.0.1:8080..."
cd "$ROOT_DIR/apps/api"
go run cmd/server/main.go &
API_PID=$!

# Wait briefly for backend to bind port
sleep 1

# Start Vite Frontend
echo "🌐 Starting React Vite development server on http://127.0.0.1:5173..."
cd "$ROOT_DIR/apps/web"
npm run dev -- --host 127.0.0.1 &
WEB_PID=$!

echo ""
echo "✅ Both services are running!"
echo "👉 Web App:  http://127.0.0.1:5173"
echo "👉 REST API: http://127.0.0.1:8080/api/v1/health"
echo ""
echo "Press Ctrl+C to terminate both servers."

wait
