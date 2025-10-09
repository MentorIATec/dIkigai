# Variables de Entorno para Vercel - dIkigai

## Configuración Completa para Vercel

Basado en tu configuración de Firebase, aquí están todas las variables de entorno que necesitas configurar en Vercel:

### 🔐 Variables de Autenticación
```bash
AUTH_PROVIDER=firebase
AUTH_SECRET=CHANGE_ME_DEV_SECRET
```

### 🔥 Variables de Firebase (Basadas en tu configuración)
```bash
FIREBASE_PROJECT_ID=digitalikigai-f8690
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@digitalikigai-f8690.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANTE: Formato de FIREBASE_PRIVATE_KEY**
- Debe incluir las comillas dobles al inicio y final
- Debe tener `\n` literales (no saltos de línea reales)
- Debe incluir `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Ejemplo correcto: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`

### 🔒 Variables de Encriptación
```bash
ENCRYPTION_KEY=default-key-32-chars-long-12345
HASH_SALT=default-salt
```

### 🎓 Variables de Matrícula
```bash
MATRICULA_SALT=default-matricula-salt
MATRICULA_ENC_KEY_CURRENT_KID=default
MATRICULA_KEYS_JSON={"default":"dGVzdC1rZXktMzItY2hhcnMtbG9uZy0xMjM0NQ=="}
MATRICULA_ENC_KEY=your-legacy-key
```

### ⚙️ Variables de Next.js
```bash
NEXT_PUBLIC_GOAL_GEN_V2=1
```

### 🌐 Variables de Firebase Client (Opcionales)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDhqRCalZndbQF_J8lIjAP0N8sSKegWAuU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=digitalikigai-f8690.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=digitalikigai-f8690
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=digitalikigai-f8690.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=435666579143
NEXT_PUBLIC_FIREBASE_APP_ID=1:435666579143:web:9ec4b3476293ac1e36d8e2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RS33LPKC6X
```

## 🚨 IMPORTANTE: Obtener Firebase Admin SDK

Para obtener las credenciales de Firebase Admin SDK:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `digitalikigai-f8690`
3. Ve a **Project Settings** (⚙️) → **Service Accounts**
4. Haz clic en **Generate new private key**
5. Descarga el archivo JSON
6. Extrae estos valores del JSON:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

**🔧 FORMATO CORRECTO PARA FIREBASE_PRIVATE_KEY:**

Del archivo JSON descargado, copia el valor de `private_key` que se ve así:
```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
}
```

**En Vercel, configura la variable así:**
- **Name**: `FIREBASE_PRIVATE_KEY`
- **Value**: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`
- **IMPORTANTE**: Incluye las comillas dobles y los `\n` literales

## 📋 Configuración Mínima para Desarrollo

Si quieres usar modo de desarrollo temporalmente:

```bash
AUTH_PROVIDER=dev
AUTH_SECRET=CHANGE_ME_DEV_SECRET
ENCRYPTION_KEY=default-key-32-chars-long-12345
HASH_SALT=default-salt
MATRICULA_SALT=default-salt
MATRICULA_KEYS_JSON={"default":"dGVzdC1rZXktMzItY2hhcnMtbG9uZy0xMjM0NQ=="}
MATRICULA_ENC_KEY_CURRENT_KID=default
NEXT_PUBLIC_GOAL_GEN_V2=1
```

## 🔧 Cómo Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `dIkigai`
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable una por una:
   - **Name**: El nombre de la variable (ej: `AUTH_PROVIDER`)
   - **Value**: El valor de la variable (ej: `firebase`)
   - **Environment**: Selecciona `Production`, `Preview`, y `Development`
5. Haz clic en **Save**
6. **Redespliega** tu aplicación

## ⚠️ Notas de Seguridad

- **NUNCA** commits las credenciales de Firebase al repositorio
- Usa valores seguros para `AUTH_SECRET` en producción
- `ENCRYPTION_KEY` debe ser exactamente 32 caracteres
- Las variables con `NEXT_PUBLIC_` son visibles en el cliente

## 🧪 Verificación

Después de configurar las variables, verifica que funcionen:

1. Redespliega la aplicación
2. Ve a `/login` - debería cargar sin errores
3. Revisa los logs de Vercel para errores
4. Prueba las rutas de API como `/api/me`

## 🆘 Solución de Problemas

### Error: "Failed to parse private key: Invalid PEM formatted message"

**Causa**: La variable `FIREBASE_PRIVATE_KEY` no tiene el formato correcto.

**Solución**:
1. **Obtén la clave privada del archivo JSON de Firebase**
2. **Copia EXACTAMENTE** el valor de `private_key` del JSON
3. **En Vercel, pega el valor completo** incluyendo las comillas dobles
4. **Asegúrate de que tenga los `\n` literales** (no saltos de línea reales)

**Ejemplo de formato correcto**:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Otros errores comunes:

1. **Verifica que todas las variables estén configuradas**
2. **Revisa los logs de Vercel** para errores específicos
3. **Usa modo dev temporalmente** cambiando `AUTH_PROVIDER=dev`
4. **Redespliega** después de cambiar las variables
