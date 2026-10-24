# Hosting and deployment

Serve the repository root over HTTPS. For Firebase Hosting, install the Firebase CLI, run `firebase login`, initialize Hosting for this project, select the repository root as the public directory, and deploy with `firebase deploy --only hosting`. Keep SPA fallback to `/index.html` and do not expose local secrets. Add a GitHub Actions workflow only after repository secrets and deployment permissions are configured. Test a preview channel first. Offline caching works on localhost or HTTPS, not a `file://` URL.

The installed web app shell includes a scalable SVG icon. If app-store or browser requirements call for fixed PNG icon sizes, export the SVG to 72, 96, 128, 144, 152, 192, 384 and 512 pixel PNG files and reference those in the manifest.
