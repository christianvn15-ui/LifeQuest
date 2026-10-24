# Asset guide

The avatar is composed from simple inline SVG paths and stores appearance as JSON. Extend the SVG renderer in `js/views/avatar.js`; use sanitized, code-owned SVG fragments only. Add hairstyles and clothing as independent layers with stable IDs, then document color variants and accessible labels. Icons can remain vector assets. PWA manifest currently uses an SVG icon; export raster sizes only where a target platform requires them.
