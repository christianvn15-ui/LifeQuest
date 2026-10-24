# Production readiness checklist

LifeQuest currently runs as a local demo. These are the concrete additions required before calling it a production PWA.

## 1. Run it

- With Node.js 20 or newer: `node server.mjs`, then open `http://localhost:4173`.
- If npm is installed: `npm start` does the same thing. No packages are needed for the demo server.
- On Windows, `run-local.ps1` starts the server and opens the page.
- The local server is for development only. It binds to loopback and does not provide HTTPS or production security headers.

## 2. Create and configure Firebase

1. Create a Firebase project and register a Web app in the Firebase console.
2. Copy its web app configuration into `firebase/firebase-config.js`. These client identifiers are public; never paste service-account JSON or private keys into the site.
3. Enable the authentication methods you plan to support and configure authorized domains, email verification, and recovery flows.
4. Create Firestore in the correct region. Review and deploy the rules and indexes; test authorization as owner, another user, signed-out user, and administrator before enabling real data.
5. Add a real app-auth module and connect sign-up, sign-in, sign-out, password reset, verification state, account deletion, and profile creation. None of these are implemented yet.
6. Implement Firestore persistence and migration from the current local demo data. Use server timestamps, pagination, conflict handling, and offline synchronization deliberately.
7. Move XP, coins, level changes, achievement grants, family approval, and admin actions to trusted backend code. A client can alter local storage and must never be allowed to award itself trusted rewards. Firebase Cloud Functions deployment requires Blaze; if staying Spark-only, do not issue competitive or redeemable rewards that need trusted server validation.
8. Add and enforce App Check after validating production and preview domains. Add Storage only with validated upload types, sizes, and private paths.

## 3. Finish the product before public release

- Implement the requested account/onboarding, role and age handling, consent and guardian controls, family/guild membership, relationships, faith options, notifications, localization, and real admin workflows. These screens/services are currently absent or placeholders.
- Define data minimization, privacy controls, export/deletion, retention, abuse reports, moderation, and incident response. Get specialist review before storing children's data or health, faith, or relationship journal content.
- Complete accessibility review with keyboard and screen reader users, translations with native review, and mobile/browser compatibility checks.
- Add automated checks for security rules and critical account/reward flows, dependency scanning, error monitoring, backups, and staged release/rollback procedures.

## 4. PWA install and offline requirements

- Deploy on HTTPS; Firebase Hosting provides HTTPS for its hosted domains. Configure a custom domain and authorized Auth domains if needed.
- Replace the single SVG icon with verified install icons in PNG sizes 192×192 and 512×512 (plus the platform sizes you target), and list them in `pwa/manifest.json`.
- Verify manifest metadata, screenshots, maskable icon safe area, install behavior, update prompts, offline fallback, and cache invalidation on real Android/iOS/desktop browsers.
- Decide which user data may be cached locally. Add secure sync/retry semantics before claiming offline writes synchronize across devices.
- Add a Content Security Policy and other production headers after deciding how Firebase SDK and any identity providers load. Keep the service worker cache limited to versioned app-shell assets.

## 5. Deploy

The repository includes Firebase and Vercel deployment configuration. Connect the GitHub repository in Vercel; `vercel.json` sets the static build command and output directory. For Firebase Hosting, build the output first, then from the project directory:

```sh
npm install --global firebase-tools
firebase login
firebase use --add
node build.mjs
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

Only add `,storage` to the deploy command if using Cloud Storage and the project is on Blaze with reviewed rules. Firebase Cloud Storage requires Blaze as of February 3, 2026, and Cloud Functions deployment also requires Blaze. Use Firebase Hosting preview channels before live deploy. Configure `firebase use --add` interactively; do not commit `.firebaserc` if it contains a project alias you do not want shared. Set up usage/budget alerts and monitor quotas. Spark is a set of finite quotas, not an unlimited scale guarantee; verify current plan and product eligibility before relying on any service.

## Release gate

Do not describe this scaffold as production-ready until authentication, server-trusted data changes, rules tests, child/privacy review, backups, error monitoring, install icons, accessibility checks, and recovery/incident procedures are complete.
