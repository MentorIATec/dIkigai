import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { firebaseClientConfig } from './client-config';

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (clientApp) {
    return clientApp;
  }
  const existing = getApps()[0];
  clientApp = existing ?? initializeApp(firebaseClientConfig);
  return clientApp;
}

export function getFirebaseAuth(): Auth {
  if (clientAuth) {
    return clientAuth;
  }
  clientAuth = getAuth(getFirebaseApp());
  return clientAuth;
}

export function getGoogleProvider(): GoogleAuthProvider {
  return new GoogleAuthProvider();
}

export { firebaseClientConfig };
