import { firebaseReady } from '../firebase.js';

export function signup() {
  return `<main class="auth-shell"><section class="auth-card" aria-labelledby="auth-title"><a class="brand auth-brand" href="#signup">Life<span>Quest</span></a><p class="eyebrow">YOUR STORY STARTS HERE</p><h1 id="auth-title">Create your account</h1><p class="muted">Turn your life into an adventure. Your account is yours; choose what to track later.</p>
    ${firebaseReady ? '<p class="notice">Your account profile will be stored in your configured Firebase project. We do not store your password.</p>' : '<p class="notice warning">Firebase is not connected yet. You can try the playable demo below; real account creation will work after Firebase is configured.</p>'}
    <form class="form auth-form" data-auth="signup">
      <div class="auth-fields"><label class="field">Username<input name="username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" autocomplete="username" placeholder="adventurer_1"></label><label class="field">Display name<input name="displayName" required maxlength="50" autocomplete="name" placeholder="How should we call you?"></label></div>
      <label class="field">Email<input type="email" name="email" required maxlength="254" autocomplete="email" placeholder="you@example.com"></label>
      <label class="field">Password<input type="password" name="password" required minlength="10" autocomplete="new-password" placeholder="At least 10 characters"></label>
      <div class="auth-fields"><label class="field">Country <span class="muted">(optional)</span><input name="country" maxlength="80" autocomplete="country-name"></label><label class="field">Language<select name="language"><option value="en">English</option><option value="af">Afrikaans</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="ar">العربية</option><option value="hi">हिन्दी</option><option value="zh">中文</option><option value="ja">日本語</option></select></label></div>
      <div class="auth-fields"><label class="field">Timezone<input name="timezone" required maxlength="80" value="${safe(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')}"></label><label class="field">Date of birth<input type="date" name="dateOfBirth" required autocomplete="bday"></label></div>
      <p class="muted age-note">At this early stage, account signup is limited to adults 18 and older. Child accounts need guardian controls that are not implemented yet.</p>
      <label class="check-row"><input type="checkbox" name="remember" checked><span>Keep me signed in on this device</span></label>
      <p class="auth-message" id="auth-message" role="status" aria-live="polite"></p>
      <button class="button auth-submit" type="submit" ${firebaseReady ? '' : 'disabled'}>Create my account</button>
    </form>
    <div class="auth-links"><span>Already have an account?</span> <a href="#login" data-go="login">Sign in</a></div>
    <div class="auth-divider"><span>OR</span></div><button class="button secondary auth-submit" type="button" data-action="demo">Continue with playable demo</button>
    <p class="auth-footnote">The demo keeps progress in this browser only. Do not use it for private or sensitive information.</p>
  </section></main>`;
}

export function login() {
  return `<main class="auth-shell"><section class="auth-card" aria-labelledby="auth-title"><a class="brand auth-brand" href="#signup">Life<span>Quest</span></a><p class="eyebrow">WELCOME BACK</p><h1 id="auth-title">Sign in</h1><p class="muted">Continue your adventure.</p>${firebaseReady ? '' : '<p class="notice warning">Firebase is not configured. Use the playable demo, or return after Firebase is connected.</p>'}
    <form class="form auth-form" data-auth="login"><label class="field">Email<input name="email" type="email" required autocomplete="email"></label><label class="field">Password<input name="password" type="password" required autocomplete="current-password"></label><label class="check-row"><input type="checkbox" name="remember" checked><span>Keep me signed in on this device</span></label><p class="auth-message" id="auth-message" role="status" aria-live="polite"></p><button class="button auth-submit" type="submit" ${firebaseReady ? '' : 'disabled'}>Sign in</button></form>
    <div class="auth-links"><button class="link-button" type="button" data-action="reset-password" ${firebaseReady ? '' : 'disabled'}>Forgot password?</button><span>·</span><a href="#signup" data-go="signup">Create account</a></div><div class="auth-divider"><span>OR</span></div><button class="button secondary auth-submit" type="button" data-action="demo">Continue with playable demo</button></section></main>`;
}

export function verifyEmail(user) {
  return `<main class="auth-shell"><section class="auth-card" aria-labelledby="auth-title"><a class="brand auth-brand" href="#signup">Life<span>Quest</span></a><p class="eyebrow">ONE QUICK STEP</p><h1 id="auth-title">Verify your email</h1><p class="muted">We sent a verification link to <strong>${safe(user?.email || 'your email')}</strong>. Open it, then come back here.</p><p class="notice">You need a verified email before entering the app. Check your spam folder if it hasn’t arrived.</p><p class="auth-message" id="auth-message" role="status" aria-live="polite"></p><div class="form"><button class="button auth-submit" data-action="refresh-verification">I verified my email</button><button class="button secondary auth-submit" data-action="resend-verification">Resend verification email</button><button class="link-button" data-action="logout">Sign out</button></div></section></main>`;
}

function safe(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
