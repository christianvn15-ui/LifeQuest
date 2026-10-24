# Firebase setup

1. Create a Firebase project and register a Web app. A Firebase account/project may require billing information; this application does not include paid APIs, but Firebase limits and pricing can change.
2. Enable Email/Password authentication. Configure authorized domains and email verification/password reset templates. Enable Google or Microsoft providers only after configuring provider credentials and redirect domains.
3. Create Firestore in a region that suits your users and data residency needs. Review `firebase/firestore-rules.txt`, deploy it, and add indexes when Firestore reports a required query index.
4. Cloud Storage for Firebase now requires the Blaze pay-as-you-go plan (requirement effective February 3, 2026). Skip Storage if you need to stay Spark-only; use the local avatar and omit profile-image uploads. If you choose Storage, budget and billing alerts are required and deploy `firebase/storage-rules.txt` only after review.
5. Copy Firebase web app values into `firebase/firebase-config.js`. Web config is public by design; security comes from rules, App Check, and authentication. Never add service account keys.
6. Enable App Check for deployed web origins before opening access. Analytics and Cloud Messaging need consent/privacy decisions; FCM web push needs HTTPS and a VAPID key. Cloud Functions requires Blaze, so trusted reward processing with Functions conflicts with a strict no-billing requirement. Do not send trusted reward writes directly from the browser as a workaround.
7. Local demo data is stored in this browser. This starter intentionally does not claim account creation, data synchronization, push messaging, or verified parental controls until those integrations are implemented and audited.
