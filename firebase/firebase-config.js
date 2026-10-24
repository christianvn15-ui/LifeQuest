// Firebase Web App configuration. These client identifiers are public; authorization
// must be enforced by Firebase Authentication and database/storage rules.
// Never put service-account JSON or private keys in browser code.
export const firebaseConfig = {
  apiKey: 'AIzaSyDWz8Pw6QogItE-FRJBVvQXi7jTGtcGqW8',
  authDomain: 'lifequest-d81c8.firebaseapp.com',
  databaseURL: 'https://lifequest-d81c8-default-rtdb.firebaseio.com',
  projectId: 'lifequest-d81c8',
  storageBucket: 'lifequest-d81c8.firebasestorage.app',
  messagingSenderId: '683148208069',
  appId: '1:683148208069:web:efa295657b56818165cdac',
  measurementId: 'G-1R67HPBMCH'
};
export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
