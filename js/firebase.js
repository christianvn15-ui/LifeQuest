// FIREBASE CONFIG HERE: add the public Web App config in firebase/firebase-config.js.
// This module deliberately never accepts or stores service-account credentials.
import { firebaseConfig, firebaseReady } from '../firebase/firebase-config.js';

let servicesPromise;
async function services() {
  if (!firebaseReady) throw new Error('Firebase is not configured yet. Add your Firebase Web App settings first.');
  if (!servicesPromise) servicesPromise = (async () => {
    const [appSdk, authSdk, dbSdk] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js')
    ]);
    const app = appSdk.initializeApp(firebaseConfig);
    return { auth: authSdk.getAuth(app), db: dbSdk.getFirestore(app), authSdk, dbSdk };
  })();
  return servicesPromise;
}

export { firebaseReady };
export async function observeAuth(callback) {
  const { auth, authSdk } = await services();
  return authSdk.onAuthStateChanged(auth, callback, error => callback(null, error));
}
export async function createAccount({ email, password, displayName, username, country, language, timezone, dateOfBirth, remember }) {
  const { auth, db, authSdk, dbSdk } = await services();
  await authSdk.setPersistence(auth, remember ? authSdk.browserLocalPersistence : authSdk.browserSessionPersistence);
  const credential = await authSdk.createUserWithEmailAndPassword(auth, email.trim(), password);
  await authSdk.updateProfile(credential.user, { displayName: displayName.trim() });
  await dbSdk.setDoc(dbSdk.doc(db, 'users', credential.user.uid), {
    displayName: displayName.trim(), username: username.trim().toLowerCase(), country: country.trim(),
    language, timezone, dateOfBirth, roles: [], goals: [], createdAt: dbSdk.serverTimestamp()
  });
  await authSdk.sendEmailVerification(credential.user);
  return credential.user;
}
export async function signIn(email, password, remember) {
  const { auth, authSdk } = await services();
  await authSdk.setPersistence(auth, remember ? authSdk.browserLocalPersistence : authSdk.browserSessionPersistence);
  return (await authSdk.signInWithEmailAndPassword(auth, email.trim(), password)).user;
}
export async function signOut() { const { auth, authSdk } = await services(); return authSdk.signOut(auth); }
export async function resetPassword(email) {
  const { auth, authSdk } = await services();
  return authSdk.sendPasswordResetEmail(auth, email.trim());
}
export async function resendVerification() {
  const { auth, authSdk } = await services();
  if (!auth.currentUser) throw new Error('Sign in again to resend your verification email.');
  return authSdk.sendEmailVerification(auth.currentUser);
}
export async function refreshVerification() {
  const { auth, authSdk } = await services();
  if (!auth.currentUser) return null;
  await authSdk.reload(auth.currentUser);
  return auth.currentUser;
}
