# PWA installation and offline use

Open the hosted site on HTTPS or run it on localhost. The browser caches the app shell and can reopen it offline; user progress uses local storage. In a supporting browser, use its Install/Add to Home Screen command. The app manifest and service worker live in `pwa/`. Clear the site cache or increment the cache version after changing shell resources. Offline writes do not yet synchronize across devices.
