// Build the static deployment directory from an explicit allowlist.
// Local server scripts, documentation, and Firebase rule files stay out of public hosting.
import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const output = resolve(root, 'dist');
await mkdir(output, { recursive: true });
for (const entry of ['index.html', 'css', 'js', 'assets', 'data', 'pwa', 'admin']) {
  await cp(resolve(root, entry), resolve(output, entry), { recursive: true, force: true });
}
await mkdir(resolve(output, 'firebase'), { recursive: true });
await cp(resolve(root, 'firebase/firebase-config.js'), resolve(output, 'firebase/firebase-config.js'), { force: true });
console.log('LifeQuest static build created in ./dist');
