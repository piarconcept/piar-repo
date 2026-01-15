#!/bin/bash

# PIAR Monorepo - Complete Verification Script
# Runs all checks to ensure the entire application is working correctly

set -e  # Exit on error

echo "🔍 PIAR Monorepo - Complete Verification"
echo "========================================"
echo ""

echo "📦 Step 1: Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

echo "🔨 Step 2: Building all packages..."
pnpm turbo build
echo "✅ Build completed"
echo ""

echo "🔍 Step 3: Type checking..."
pnpm typecheck
echo "✅ Type check passed"
echo ""

echo "🧪 Step 4: Running tests with coverage..."
pnpm test:coverage -- --run
echo "✅ All tests passed"
echo ""

echo "🎨 Step 5: Linting code..."
pnpm lint
echo "✅ Linting passed"
echo ""

echo "🎉 All checks passed successfully!"
echo "========================================"
echo ""
echo "  ✅ Linting passed"
echo "Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ All packages built"
echo "  ✅ Type checking passed"
echo "  ✅ All tests passed with coverage"
echo ""
echo "Your monorepo is ready! 🚀"
