#!/bin/bash

# Script para instalar Playwright y sus dependencias
set -e

echo "Installing Playwright dependencies..."

# Verificar si npm está disponible
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

# Instalar dependencias de npm
echo "Installing npm dependencies..."
npm ci

# Verificar si Playwright está instalado
if ! npx playwright --version &> /dev/null; then
    echo "Error: Playwright is not installed"
    exit 1
fi

# Instalar navegadores de Playwright
echo "Installing Playwright browsers..."
npx playwright install --with-deps

echo "Playwright installation completed successfully!"
