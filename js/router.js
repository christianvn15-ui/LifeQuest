import { getState, update } from './state.js';
import { nav } from './ui.js';
import { dashboard } from './views/dashboard.js';
import { quests } from './views/quests.js';
import { avatar } from './views/avatar.js';
import { campaigns } from './views/campaigns.js';
import { settings } from './views/settings.js';
import { login, signup, verifyEmail } from './views/auth.js';
import { firebaseReady, createAccount, signIn, signOut, resetPassword, resendVerification, refreshVerification } from './firebase.js';

const pages = { dashboard, quests, avatar, campaigns, settings };
let authUser = null;
let authReady = !firebaseReady;
let authError = null;

export function setAuthState(user, ready = true, error = null) {
  authUser = user;
  authReady = ready;
  authError = error;
}
export function go(page) { history.pushState({}, '', `#${page}`); renderPage(); }

export function renderPage() {
  const state = getState();
  document.documentElement.dataset.theme = state.settings.theme || 'light';
  const page = location.hash.replace('#', '') || 'signup';
  const root = document.querySelector('#app');

  if (firebaseReady && !authReady) {
    root.innerHTML = '<main class="auth-shell"><p class="boot" role="status">Connecting to your account…</p></main>';
    return;
  }
  if (firebaseReady && authError && !authUser && !state.demo) {
    root.innerHTML = `${signup()}<p class="auth-global-error" role="alert">Could not initialize Firebase. Check the web app configuration and network, then reload.</p>`;
    return;
  }
  if (authUser && !authUser.emailVerified) {
    root.innerHTML = verifyEmail(authUser);
    bind();
    return;
  }
  if (!authUser && !state.demo) {
    root.innerHTML = page === 'login' ? login() : signup();
    bind();
    return;
  }

  const view = pages[page] || dashboard;
  root.innerHTML = `<div class="shell"><aside class="sidebar"><a class="brand" href="#dashboard" aria-label="LifeQuest home" data-go="dashboard">Life<span>Quest</span></a>${nav(page)}<div class="user-chip">⚔️ ${esc(authUser?.displayName || state.profile.name)}<br><span class="muted">${authUser ? esc(authUser.email) : 'Local demo · this device'}</span><button class="link-button" data-action="logout">${authUser ? 'Sign out' : 'Exit demo'}</button></div></aside><main class="main">${view(state)}</main></div>`;
  bind();
}

function bind() {
  document.querySelectorAll('[data-go]').forEach(element => element.addEventListener('click', event => {
    event.preventDefault(); go(element.dataset.go);
  }));

  document.querySelectorAll('[data-action]').forEach(element => element.addEventListener('click', async () => {
    const action = element.dataset.action;
    const id = element.dataset.id;
    if (action === 'complete') update(state => {
      const quest = state.quests.find(item => item.id === id);
      if (quest && !quest.done) {
        quest.done = true; state.xp += quest.xp; state.coins += quest.coins;
        state.stats.discipline = Math.min(100, state.stats.discipline + 1);
        if (state.xp >= state.level * 100) { state.xp -= state.level * 100; state.level++; }
      }
    });
    if (action === 'delete') update(state => { state.quests = state.quests.filter(item => item.id !== id); });
    if (action === 'theme') update(state => { state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark'; });
    if (action === 'demo') { update(state => { state.demo = true; }); location.hash = '#dashboard'; }
    if (action === 'logout') {
      try { if (authUser) await signOut(); } catch (error) { showAuthMessage(error.message); return; }
      authUser = null; update(state => { state.demo = false; }); location.hash = '#signup';
    }
    if (action === 'reset' && confirm('Reset this device’s LifeQuest demo data?')) { localStorage.clear(); location.hash = '#signup'; location.reload(); return; }
    if (action === 'reset-password') {
      const email = document.querySelector('[name="email"]')?.value?.trim();
      if (!email) { showAuthMessage('Enter your email address first.'); return; }
      try { await resetPassword(email); showAuthMessage('Password reset email sent. Check your inbox.', true); }
      catch (error) { showAuthMessage(friendlyAuthError(error)); }
      return;
    }
    if (action === 'resend-verification') {
      try { await resendVerification(); showAuthMessage('Verification email sent again.', true); }
      catch (error) { showAuthMessage(friendlyAuthError(error)); }
      return;
    }
    if (action === 'refresh-verification') {
      try {
        const user = await refreshVerification();
        if (user?.emailVerified) { setAuthState(user); renderPage(); }
        else showAuthMessage('We still do not see verification. Open the link in your email, then try again.');
      } catch (error) { showAuthMessage(friendlyAuthError(error)); }
      return;
    }
    renderPage();
  }));

  document.querySelectorAll('[data-system]').forEach(element => element.addEventListener('change', () => {
    update(state => { state.settings.systems[element.dataset.system] = element.checked; });
  }));
  document.querySelectorAll('[data-campaign]').forEach(element => element.addEventListener('click', () => {
    update(state => { const campaign = state.campaigns[+element.dataset.campaign]; if (campaign) campaign.progress = Math.min(campaign.total, campaign.progress + 1); });
  }));
  const avatarForm = document.querySelector('#avatar-form');
  if (avatarForm) avatarForm.addEventListener('submit', event => {
    event.preventDefault(); const values = Object.fromEntries(new FormData(avatarForm));
    update(state => { state.avatar = { ...state.avatar, ...values }; }); renderPage();
  });
  document.querySelectorAll('form[data-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault(); const values = Object.fromEntries(new FormData(form));
    if (form.dataset.form === 'quest') update(state => state.quests.unshift({ id: crypto.randomUUID(), title: values.title, category: values.category, difficulty: values.difficulty, xp: +values.xp, coins: +values.coins, due: values.due || 'Any time', done: false }));
    if (form.dataset.form === 'profile') update(state => { state.profile.name = values.name || 'Adventurer'; state.profile.country = values.country || ''; state.profile.language = values.language; });
    if (form.dataset.form === 'campaign') update(state => state.campaigns.push({ name: values.name, progress: 0, total: +values.milestones || 3 }));
    renderPage();
  }));
  document.querySelectorAll('form[data-auth]').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault(); const values = Object.fromEntries(new FormData(form));
    const submit = form.querySelector('[type="submit"]'); if (submit) submit.disabled = true;
    showAuthMessage('');
    try {
      if (form.dataset.auth === 'signup') {
        const birth = new Date(`${values.dateOfBirth}T00:00:00`);
        const age = (Date.now() - birth.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
        if (!Number.isFinite(age) || age < 18) throw new Error('This early account flow is for adults 18+. Child accounts require guardian controls that are not available yet.');
        await createAccount(values);
        showAuthMessage('Account created. Check your email for the verification link.', true);
      } else {
        const user = await signIn(values.email, values.password, Boolean(values.remember));
        setAuthState(user); renderPage();
      }
    } catch (error) { showAuthMessage(friendlyAuthError(error)); if (submit) submit.disabled = false; }
  }));
}

function showAuthMessage(message, success = false) {
  const target = document.querySelector('#auth-message');
  if (!target) return;
  target.textContent = message;
  target.classList.toggle('success', success);
}
function friendlyAuthError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account already uses that email. Try signing in instead.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/weak-password': 'Choose a longer password.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Wait a little and try again.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'permission-denied': 'Firebase rejected the profile write. Deploy the current Firestore rules and try again.'
  };
  return messages[error?.code] || messages[error?.message] || error?.message || 'Something went wrong. Please try again.';
}

export const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
