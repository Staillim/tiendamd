import admin from 'firebase-admin';

let db = null;
let auth = null;

export function initializeFirebase() {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    admin.initializeApp({
      credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
    });

    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando Firebase Admin:', error.message);
  }
}

export function getDb() {
  if (!db) throw new Error('Firestore no inicializado');
  return db;
}

export function getAuth() {
  if (!auth) throw new Error('Auth no inicializado');
  return auth;
}

export function getTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

export function getIncrement(value = 1) {
  return admin.firestore.FieldValue.increment(value);
}
