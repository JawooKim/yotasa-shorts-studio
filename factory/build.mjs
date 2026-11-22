// electron/main.ts 를 Electron 없이 돌 수 있는 Node 번들(dist-factory/engine.cjs)로 만든다.
import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: [path.join(here, '..', 'electron', 'main.ts')],
  outfile: path.join(here, '..', 'dist-factory', 'engine.cjs'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  packages: 'external',
  alias: { electron: path.join(here, 'electron-stub.cjs') },
  define: {},
  logLevel: 'warning',
});
console.log('[factory] dist-factory/engine.cjs 빌드 완료');
