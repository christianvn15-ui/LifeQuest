# LifeQuest

**Turn Your Life Into An Adventure.** LifeQuest is a local-first life RPG prototype built with HTML, CSS, and vanilla JavaScript. Run it from a local static HTTP server or Firebase Hosting; the shell can be installed as a PWA and its demo progress persists in browser local storage.

## Start here

With Node.js 20 or newer, run `node server.mjs` and open `http://localhost:4173`. On Windows you can run `.\run-local.ps1`, which starts the local server and opens the page; press Enter in that PowerShell window to stop it. If npm is installed, `npm start` is an alias. Build a static deploy with `node build.mjs` or `npm run build`. The app is an ES module and service workers require localhost or HTTPS. Your demo data stays on this device. There is no account system or cross-device sync in this prototype.

## Included

- Responsive dashboard with five core stats: Health, Strength, Intelligence, Discipline, Relationships.
- Local quest creation and completion with XP, coin, level, and discipline progress.
- Campaign milestones, editable SVG avatar appearance, profile and optional-system preferences.
- Light/dark themes, reduced-motion support, keyboard-operable controls, and PWA shell caching.
- Starter Firestore/Storage rules, suggested collection model, sample catalogs, Firebase configuration template, admin CMS placeholder, and deployment/security guides.

## Not yet production features

Signup/sign-in, Google/Microsoft identity providers, verified age/guardian permissions, synchronized Firestore writes, trusted reward transactions, family/guild membership and chat, relationship/faith journals, push notifications, full localization, and real admin management are not implemented. The admin page is explicitly a non-editing preview. Do not deploy this as a child-facing or sensitive-data service until these features, threat modeling, and privacy requirements are implemented and reviewed. See `docs/` and `firebase/database-structure.md` for boundaries and next steps.

Firebase free-tier availability and quotas are not a promise of unlimited global operation. Confirm current Firebase terms and regional/data-protection requirements before launch.

See [production-readiness.md](docs/production-readiness.md) for Firebase setup, deployment commands, and the features that still need implementation before a public launch.
