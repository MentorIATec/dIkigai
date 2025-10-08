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
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
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

## Notas Importantes

- Si `FIREBASE_PROJECT_ID` no está configurado, la aplicación usará el modo de desarrollo
- Las variables de Firebase son opcionales para desarrollo
- `AUTH_SECRET` debe ser un valor seguro en producción
- `ENCRYPTION_KEY` debe ser exactamente 32 caracteres
