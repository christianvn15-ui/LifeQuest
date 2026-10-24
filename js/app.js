import { renderPage } from './router.js';
import { registerSW } from './pwa.js';
import { getState } from './state.js';

// Central app bootstrap: local-first mode works without creating Firebase credentials.
const state = getState();
document.documentElement.dataset.theme = state.settings.theme || 'light';
renderPage();
registerSW();
window.addEventListener('popstate', renderPage);
window.addEventListener('storage', () => renderPage());
