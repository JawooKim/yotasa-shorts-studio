import path from 'path';
import fs from 'fs';
import ts from 'typescript';

const forceBuild = process.argv.includes('--force');
// 'buyer' = 구매자 배포용(관리자 기능 제거), 그 외 = 'admin'(개발/판매자용)
const EDITION = process.env.KSHORTS_EDITION === 'buyer' ? 'buyer' : 'admin';
// 라이선스 서버 주소: 저장소에 올리지 않는 admin.local.json 의 licenseServer 또는 환경 변수 KSHORTS_LICENSE_SERVER
function readLicenseServer() {
  if (process.env.KSHORTS_LICENSE_SERVER) return process.env.KSHORTS_LICENSE_SERVER.trim();
  try {
    const local = JSON.parse(fs.readFileSync(path.resolve('admin.local.json'), 'utf8'));
    return String(local?.licenseServer || '').trim();
  } catch {
    return '';
  }
}
const LICENSE_SERVER = readLicenseServer();
const BUILD_MARK = `${EDITION}|${LICENSE_SERVER}`;

function compileTsFile(filePath, outPath, editionChanged) {
  if (!forceBuild && !editionChanged && fs.existsSync(outPath)) {
    const srcStat = fs.statSync(filePath);
    const outStat = fs.statSync(outPath);
    if (outStat.mtimeMs >= srcStat.mtimeMs) {
      return false; // Already up-to-date, skip
    }
  }
  const sourceCode = fs.readFileSync(filePath, 'utf8').split('__KSHORTS_EDITION__').join(EDITION)
    .split('__KSHORTS_LICENSE_SERVER__').join(LICENSE_SERVER.replace(/'/g, ''));
  const result = ts.transpileModule(sourceCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      skipLibCheck: true,
      sourceMap: false,
    },
  });
  fs.writeFileSync(outPath, result.outputText, 'utf8');
  return true;
}

async function build() {
  const distDir = path.resolve('dist-electron');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 에디션이 바뀌면 캐시를 무시하고 다시 컴파일한다 (구매자용 산출물에 관리자 빌드가 섞이지 않도록)
  const markerPath = path.join(distDir, '.edition');
  const prevEdition = fs.existsSync(markerPath) ? fs.readFileSync(markerPath, 'utf8').trim() : '';
  const editionChanged = prevEdition !== BUILD_MARK;

  const mainTs = path.resolve('electron/main.ts');
  const preloadTs = path.resolve('electron/preload.ts');

  const c1 = compileTsFile(mainTs, path.join(distDir, 'main.cjs'), editionChanged);
  const c2 = compileTsFile(mainTs, path.join(distDir, 'main.js'), editionChanged);
  const c3 = compileTsFile(preloadTs, path.join(distDir, 'preload.cjs'), editionChanged);
  const c4 = compileTsFile(preloadTs, path.join(distDir, 'preload.js'), editionChanged);

  fs.writeFileSync(markerPath, BUILD_MARK, 'utf8');
  console.log(`[build-electron] edition = ${EDITION}, license server ${LICENSE_SERVER ? '설정됨' : '없음'}`);
  if (c1 || c2 || c3 || c4) {
    console.log('⚡ Electron main & preload built successfully (100% Cross-Platform Node Engine).');
  } else {
    console.log('⚡ Electron main & preload up-to-date (cached, 0ms).');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

