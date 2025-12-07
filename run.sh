#!/bin/bash
# Script to build and run the InstaWrapped combined app

set -e

echo "🔨 Building frontend..."
npm run build

echo "🔨 Building Go backend..."
go build -o server .

echo "🚀 Starting InstaWrapped server..."
echo "📱 Frontend + Backend running at http://localhost:8080"
echo "Press Ctrl+C to stop"
echo ""

./server
