// Firebase is opt-in. Load the modular SDK from Google's CDN only after config is supplied.
// Local-first demo remains usable without a Firebase project or network connection.
export async function connectFirebase(config){if(!config?.projectId||!config?.apiKey)throw new Error('Add Firebase web app configuration first.');const {initializeApp}=await import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js');const app=initializeApp(config);return app}
