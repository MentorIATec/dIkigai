# Operaciones de Seguridad y Rotación de Matrícula

## Variables de entorno clave
- `MATRICULA_KEYS_JSON`: mapa JSON `{ "kid": "base64" }` con todas las llaves activas.
- `MATRICULA_ENC_KEY_CURRENT_KID`: identificador de la llave vigente.
- `MATRICULA_SALT`: cadena usada para saltear el hash SHA-256 de la matrícula.

## Rotación de llaves
1. Genera una nueva llave AES-256 y codifícala en Base64.
2. Añade la nueva entrada al JSON de `MATRICULA_KEYS_JSON` sin eliminar las anteriores.
3. Actualiza `MATRICULA_ENC_KEY_CURRENT_KID` para apuntar al nuevo `kid`.
4. Ejecuta el endpoint `POST /api/admin/crypto/reencrypt` con `{ "dryRun": true }` para conocer cuántos registros requieren migración.
5. Ejecuta nuevamente con `{ "dryRun": false }` para re-cifrar. Usa `resumeToken` si la colección es grande.
6. Verifica que todos los documentos tengan `matricula_enc.kid` igual al nuevo `kid`.
7. Opcional: elimina llaves antiguas del JSON una vez validada la migración.

## Auditoría
- Las acciones sensibles (ver matrícula, exportar CSV) generan registros en `audit_logs`.
- Cada entrada almacena: usuario, rol, recurso, `subjectUid`, `metadata` y marca de tiempo.
- Puedes filtrar logs por recurso en la consola de Firestore o exportarlos con el Admin SDK.

## Exportaciones y respaldos
- Usa `npx ts-node scripts/export-students.ts` para exportar perfiles sin PII a `students-export.csv`.
- El script utiliza el mismo mecanismo de autenticación que la aplicación y respeta el hash/cifrado.

## Consideraciones adicionales
- Nunca expongas `MATRICULA_KEYS_JSON`, `MATRICULA_ENC_KEY_CURRENT_KID` ni `MATRICULA_SALT` en el cliente.
- Regenera la cookie de sesión después de rotar llaves o cambiar reclamaciones de rol.
- En caso de sospecha de abuso, consulta `audit_logs` por `action` y revoca sesiones con `POST /api/auth/logout` seguido de `revokeSessions`.
