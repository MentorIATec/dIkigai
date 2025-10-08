# Playwright Setup Guide

Este documento explica cómo configurar Playwright para el proyecto dIkigai.

## Instalación Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Verificar instalación de Playwright
```bash
npm run playwright:verify
```

### 3. Instalar navegadores de Playwright
```bash
npm run playwright:install
```

## Configuración

### Archivos de configuración
- `playwright.config.ts` - Configuración principal de Playwright
- `scripts/preview-screenshots.ts` - Script para generar screenshots de preview

### Variables de entorno
- `PLAYWRIGHT_BASE_URL` - URL base para las pruebas (default: http://127.0.0.1:9002)
- `SKIP_PREVIEWS` - Saltar generación de screenshots (default: false)
- `VERCEL` - Variable de Vercel para saltar previews en deployment

## Scripts disponibles

```bash
# Verificar instalación
npm run playwright:verify

# Instalar navegadores
npm run playwright:install

# Generar screenshots de preview
npm run preview:screens

# Generar screenshots de forma segura (con skip si es necesario)
npm run preview:screens:safe

# Ejecutar servidor y generar screenshots
npm run preview:all
```

## GitHub Actions

El workflow `.github/workflows/preview-screens.yml` está configurado para:

1. Instalar dependencias con `npm ci`
2. Verificar instalación de Playwright
3. Instalar navegadores de Playwright
4. Construir la aplicación
5. Generar screenshots de preview
6. Subir screenshots como artifact

## Solución de problemas

### Error: "could not determine executable to run"
Este error indica que Playwright no está instalado correctamente. Solución:

1. Verificar que `@playwright/test` esté en `package.json`
2. Ejecutar `npm install`
3. Ejecutar `npm run playwright:install`

### Error: "Browser not found"
Este error indica que los navegadores de Playwright no están instalados. Solución:

```bash
npm run playwright:install
```

### Error en GitHub Actions
Si el workflow falla:

1. Verificar que las dependencias estén correctamente listadas en `package.json`
2. Verificar que el workflow tenga los pasos de instalación correctos
3. Revisar los logs del workflow para más detalles

## Dependencias

Las siguientes dependencias son necesarias para Playwright:

```json
{
  "devDependencies": {
    "@playwright/test": "^1.43.0",
    "playwright": "^1.43.0"
  }
}
```
