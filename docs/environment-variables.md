# Variables de Entorno Requeridas

Este documento describe las variables de entorno necesarias para el funcionamiento de la aplicación.

## Variables Requeridas para Vercel

### Configuración de Autenticación
```bash
AUTH_PROVIDER=dev
AUTH_SECRET=CHANGE_ME_DEV_SECRET
```

### Configuración de Firebase (Opcional)
```bash
FIREBASE_PROJECT_ID=digitalikigai-f8690
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@digitalikigai-f8690.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Configuración de Encriptación
```bash
ENCRYPTION_KEY=default-key-32-chars-long-12345
HASH_SALT=default-salt
```

### Configuración de Matrícula (Opcional)
```bash
MATRICULA_SALT=default-matricula-salt
MATRICULA_ENC_KEY_CURRENT_KID=default
MATRICULA_KEYS_JSON={"default":"your-encryption-key"}
MATRICULA_ENC_KEY=your-legacy-key
```

### Configuración de Next.js
```bash
NEXT_PUBLIC_GOAL_GEN_V2=1
```

## Configuración en Vercel

1. Ve a tu proyecto en Vercel
2. Ve a Settings > Environment Variables
3. Agrega las variables listadas arriba
4. Para desarrollo, usa los valores por defecto
5. Para producción, configura valores seguros

### Variables Mínimas para Vercel (Sin Firebase)

Para que la aplicación funcione básicamente en Vercel, configura estas variables:

```bash
AUTH_PROVIDER=dev
AUTH_SECRET=CHANGE_ME_DEV_SECRET
ENCRYPTION_KEY=default-key-32-chars-long-12345
HASH_SALT=default-salt
NEXT_PUBLIC_GOAL_GEN_V2=1
```

### Variables Completas para Vercel (Con Firebase)

Para funcionalidad completa con Firebase, necesitarás:

1. **Obtener las credenciales de Firebase Admin SDK**:
   - Ve a Firebase Console > Project Settings > Service Accounts
   - Genera una nueva clave privada
   - Descarga el archivo JSON

2. **Configurar las variables en Vercel**:
   ```bash
   FIREBASE_PROJECT_ID=digitalikigai-f8690
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@digitalikigai-f8690.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[tu-clave-privada-completa]\n-----END PRIVATE KEY-----\n"
   ```

## Notas Importantes

- Si `FIREBASE_PROJECT_ID` no está configurado, la aplicación usará el modo de desarrollo
- Las variables de Firebase son opcionales para desarrollo
- `AUTH_SECRET` debe ser un valor seguro en producción
- `ENCRYPTION_KEY` debe ser exactamente 32 caracteres
