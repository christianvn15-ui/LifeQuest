// FIREBASE CONFIG HERE — copy the web app config values from Firebase Console.
// Never put service-account/private keys in browser code. These values identify a project,
// but access is controlled by Authentication, Firestore/Storage rules, and App Check.
export const firebaseConfig = { apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: '' };
export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
