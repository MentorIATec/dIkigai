#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Uso: ./scripts/setup-vercel-env.sh

echo "🚀 Configuración de Variables de Entorno para Vercel"
echo "=================================================="
echo ""

echo "📋 Variables Mínimas (Sin Firebase):"
echo "------------------------------------"
echo "AUTH_PROVIDER=dev"
echo "AUTH_SECRET=CHANGE_ME_DEV_SECRET"
echo "ENCRYPTION_KEY=default-key-32-chars-long-12345"
echo "HASH_SALT=default-salt"
echo "NEXT_PUBLIC_GOAL_GEN_V2=1"
echo ""

echo "📋 Variables Completas (Con Firebase):"
echo "--------------------------------------"
echo "FIREBASE_PROJECT_ID=digitalikigai-f8690"
echo "FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@digitalikigai-f8690.iam.gserviceaccount.com"
echo "FIREBASE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\n[tu-clave-privada]\\n-----END PRIVATE KEY-----\\n\""
echo ""

echo "🔧 Pasos para configurar en Vercel:"
echo "1. Ve a tu proyecto en Vercel Dashboard"
echo "2. Ve a Settings > Environment Variables"
echo "3. Agrega cada variable con su valor"
echo "4. Para FIREBASE_PRIVATE_KEY, asegúrate de incluir las comillas y \\n"
echo ""

echo "📝 Notas importantes:"
echo "- Las variables mínimas permiten que la app funcione en modo desarrollo"
echo "- Las variables de Firebase son necesarias para funcionalidad completa"
echo "- FIREBASE_PRIVATE_KEY debe incluir las comillas y caracteres de escape \\n"
echo ""

echo "✅ Una vez configuradas, haz redeploy de tu aplicación en Vercel"
