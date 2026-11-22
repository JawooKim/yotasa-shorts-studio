import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const isDev = process.argv.includes('--dev') || process.env.VITE_DEV === 'true';
const rootDir = process.cwd();
const distIndex = path.join(rootDir, 'dist', 'index.html');
const distElectron = path.join(rootDir, 'dist-electron', 'main.cjs');

async function runCommand(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...options });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with exit code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  if (isDev) {
    console.log('🚀 Starting K-Shorts Studio in Development Mode (Vite Dev Server)...');
    await runCommand('node', ['scripts/build-electron.js']);
    await runCommand('npx', ['concurrently', '-k', '"vite"', '"electron dist-electron/main.cjs"'], {
      env: { ...process.env, VITE_DEV: 'true' },
    });
    return;
  }

  // Fast Production Launch
  console.log('⚡ Launching K-Shorts Studio (Ultra-Fast Engine)...');

  // Check if frontend is built
  if (!fs.existsSync(distIndex)) {
    console.log('📦 Initial build not detected. Building bundle once for fast future launches...');
    await runCommand('npm', ['run', 'build:vite']);
  }

  // Ensure electron preload & main are up to date (0ms if cached)
  await runCommand('node', ['scripts/build-electron.js']);

  // Launch electron directly with pre-built bundle
  console.log('✨ Electron app ready. Opening window...');
  await runCommand('npx', ['electron', 'dist-electron/main.cjs']);
}

main().catch((err) => {
  console.error('Launch failed:', err);
  process.exit(1);
});
