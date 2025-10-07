# Firebase Deployment Notes

## Environment Variables

Set the following secrets in your hosting environment (e.g., Vercel) before enabling Firebase authentication:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (Base64 encoded, replace `\n` with literal newlines before decoding)
- `AUTH_PROVIDER=firebase`
- `ALLOWLIST_DOMAINS` (comma separated list such as `tec.mx,itesm.mx`)
- `MATRICULA_SALT` (random string used to hash student IDs)
- `MATRICULA_KEYS_JSON` (JSON object `{ "kid": "base64" }` with every active AES-256 key)
- `MATRICULA_ENC_KEY_CURRENT_KID` (key identifier in the JSON that should be used for new encryptions)

## Deploying Security Rules

The repository ships with `firestore.rules`. Deploy them with the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

For local development you can run the Firestore emulator:

```bash
firebase emulators:start --only firestore
```

Then update your local `.env.local` to point the Admin REST calls to the emulator using `FIREBASE_EMULATOR_HOST` if desired.
