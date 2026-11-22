// 설치 파일(Setup-<버전>.exe)의 SHA-256 체크섬 파일(<파일명>.sha256)을 생성한다.
// 자동 업데이트(perform-update)가 이 파일(또는 GitHub asset.digest)로 설치 파일 무결성을 검증한다.
// 사용법: node scripts/make-checksum.js [--dir <release 폴더>] [--version <버전>]
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const productName = pkg.build?.productName || 'K-Shorts Studio';
const version = arg('--version') || pkg.version;
const dir = path.resolve(arg('--dir') || path.join(root, pkg.build?.directories?.output || 'release'));
const fileName = `${productName}-Setup-${version}.exe`;
const filePath = path.join(dir, fileName);

if (!fs.existsSync(filePath)) {
  console.error(`[오류] 설치 파일을 찾을 수 없습니다: ${filePath}`);
  console.error('       먼저 설치 파일을 빌드하세요. (npm run dist)');
  process.exit(1);
}

const hash = crypto.createHash('sha256');
fs.createReadStream(filePath)
  .on('data', (c) => hash.update(c))
  .on('error', (e) => {
    console.error(`[오류] 파일 읽기 실패: ${e.message}`);
    process.exit(1);
  })
  .on('end', () => {
    const hex = hash.digest('hex');
    const outPath = `${filePath}.sha256`;
    fs.writeFileSync(outPath, `${hex}  ${fileName}\n`, 'utf8');
    console.log(`SHA-256: ${hex}`);
    console.log(`체크섬 파일 생성: ${outPath}`);
    console.log('GitHub 릴리즈에 설치 파일과 함께 이 .sha256 파일을 반드시 업로드하세요.');
  });
