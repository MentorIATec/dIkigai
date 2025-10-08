#!/bin/bash

# Script para probar la configuración de Playwright
set -e

echo "Testing Playwright setup..."

# Verificar que npm está disponible
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi
echo "✅ npm is available"

# Verificar que las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "❌ Error: node_modules directory not found. Run 'npm install' first."
    exit 1
fi
echo "✅ node_modules directory exists"

# Verificar que Playwright está instalado
if ! npx playwright --version &> /dev/null; then
    echo "❌ Error: Playwright is not installed"
    exit 1
fi
echo "✅ Playwright is installed: $(npx playwright --version)"

# Verificar que los navegadores están instalados
if ! npx playwright install --dry-run &> /dev/null; then
    echo "⚠️  Warning: Playwright browsers may not be installed. Run 'npm run playwright:install'"
else
    echo "✅ Playwright browsers are installed"
fi

# Verificar que el script de preview funciona
if [ -f "scripts/preview-screenshots.ts" ]; then
    echo "✅ Preview screenshots script exists"
else
    echo "❌ Error: Preview screenshots script not found"
    exit 1
fi

# Verificar que la configuración de Playwright existe
if [ -f "playwright.config.ts" ]; then
    echo "✅ Playwright configuration exists"
else
    echo "❌ Error: Playwright configuration not found"
    exit 1
fi

echo ""
echo "🎉 Playwright setup test completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run playwright:install' to install browsers"
echo "2. Run 'npm run preview:screens:safe' to test screenshot generation"
