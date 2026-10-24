import { renderPage, setAuthState } from './router.js';
import { registerSW } from './pwa.js';
import { getState } from './state.js';
import { firebaseReady, observeAuth } from './firebase.js';

// Central app bootstrap: local-first mode works without creating Firebase credentials.
const state = getState();
document.documentElement.dataset.theme = state.settings.theme || 'light';
renderPage();
registerSW();
window.addEventListener('popstate', renderPage);
window.addEventListener('storage', () => renderPage());

// If Firebase is configured, wait for its persisted auth session before showing signup.
if (firebaseReady) {
  observeAuth((user, error) => {
    setAuthState(user, true, error);
    renderPage();
  }).catch(error => {
    console.error('Firebase Auth could not initialize:', error);
    setAuthState(null, true, error);
    renderPage();
  });
}
