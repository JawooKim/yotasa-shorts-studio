#!/usr/bin/env node
// 쇼츠 자동 공장 - 헤드리스 렌더러
//
//   node factory/render.mjs shorts/2026-11-22-morning-habit      (작업 폴더 하나)
//   node factory/render.mjs shorts/a/job.json shorts/b/x.jpg      (바뀐 파일이 속한 작업들만)
//   node factory/render.mjs --changed-file changed.txt            (바뀐 파일 목록을 줄마다 적은 파일)
//   node factory/render.mjs --inline                              (FACTORY_JOB_JSON 환경 변수의 job)
//   node factory/render.mjs --all                                 (shorts/ 안의 모든 작업. _ 로 시작하는 폴더는 제외)
//
// 작업 폴더 = shorts/<slug>/job.json + 사용자가 올린 이미지·영상 파일.
// 결과물은 out/<slug>/ 에 <slug>.mp4, 썸네일, 대본, youtube.txt 로 저장된다.
import fs from 'fs';
import path from 'path';
import os from 'os';
import https from 'https';
import http from 'http';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHORTS_DIR = path.join(ROOT, 'shorts');
const OUT_DIR = path.resolve(process.env.FACTORY_OUT_DIR || path.join(ROOT, 'out'));

const MEDIA_IMAGE = /\.(png|jpe?g|webp|bmp)$/i;
const MEDIA_VIDEO = /\.(mp4|mov|m4v|webm|mkv)$/i;

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function slugOf(jobDir) {
  return path.basename(jobDir).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 100) || 'short';
}

function download(url, dest, redirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'shorts-factory/1.0' }, timeout: 60000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
        res.resume();
        resolve(download(new URL(res.headers.location, url).toString(), dest, redirects - 1));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} (${url})`));
        return;
      }
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on('finish', () => out.close(() => resolve(dest)));
      out.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new Error(`시간 초과 (${url})`)));
    req.on('error', reject);
  });
}

/** 장면의 image/video 값을 실제 로컬 파일 경로로 바꾼다. (작업 폴더 안의 파일 이름 또는 http(s) 주소) */
async function resolveMedia(value, jobDir, tmpDir, label, pattern) {
  const v = String(value || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) {
    const ext = (path.extname(new URL(v).pathname).toLowerCase().match(pattern) ? path.extname(new URL(v).pathname) : '') ||
      (pattern === MEDIA_VIDEO ? '.mp4' : '.jpg');
    const dest = path.join(tmpDir, `${label}${ext.toLowerCase()}`);
    try {
      await download(v, dest);
      return dest;
    } catch (e) {
      console.warn(`⚠️  ${label}: 내려받지 못해 건너뜁니다 - ${e.message}`);
      return '';
    }
  }
  const p = path.resolve(jobDir, v);
  // 작업 폴더 밖의 파일은 읽지 않는다.
  if (!p.startsWith(path.resolve(jobDir) + path.sep)) {
    console.warn(`⚠️  ${label}: 작업 폴더 밖의 경로는 쓸 수 없습니다 (${v})`);
    return '';
  }
  if (!fs.existsSync(p)) {
    console.warn(`⚠️  ${label}: 파일이 없습니다 (${v}) - AI 이미지로 대체합니다`);
    return '';
  }
  if (!pattern.test(p)) {
    console.warn(`⚠️  ${label}: 지원하지 않는 형식입니다 (${v})`);
    return '';
  }
  return p;
}

function loadJob(jobDir) {
  const jobPath = path.join(jobDir, 'job.json');
  if (!fs.existsSync(jobPath)) throw new Error(`${jobPath} 가 없습니다`);
  const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
  if (!job.title && !job.topic) throw new Error('job.json 에 title 또는 topic 이 필요합니다');
  if (!job.script && !job.topic && !(Array.isArray(job.scenes) && job.scenes.length)) {
    throw new Error('job.json 에 script, scenes, topic 중 하나는 있어야 합니다');
  }
  return job;
}

async function renderJob(engine, jobDir) {
  const job = loadJob(jobDir);
  const slug = slugOf(jobDir);
  const outDir = path.join(OUT_DIR, slug);
  fs.mkdirSync(outDir, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `factory_${slug}_`));

  // 장면: 대본이 비어 있으면 장면 문장을 이어 붙여 대본으로 쓴다.
  const rawScenes = Array.isArray(job.scenes) ? job.scenes : [];
  const scenes = [];
  for (let i = 0; i < rawScenes.length; i++) {
    const s = typeof rawScenes[i] === 'string' ? { text: rawScenes[i] } : (rawScenes[i] || {});
    const imagePath = await resolveMedia(s.image, jobDir, tmpDir, `scene${i + 1}_image`, MEDIA_IMAGE);
    const videoPath = await resolveMedia(s.video, jobDir, tmpDir, `scene${i + 1}_video`, MEDIA_VIDEO);
    scenes.push({
      id: i + 1,
      text: String(s.text || '').trim(),
      visualPrompt: s.visualPrompt || s.prompt || undefined,
      isThumbnail: i === 0,
      ...(videoPath ? { mediaType: 'video', videoUrl: videoPath, videoSource: 'local' } : {}),
      ...(imagePath ? { imagePath } : {}),
    });
  }
  let script = String(job.script || '').trim();
  if (!script && scenes.some((s) => s.text)) script = scenes.map((s) => s.text).filter(Boolean).join('\n');

  const id = `${slug}`.replace(/[^A-Za-z0-9_-]/g, '_');
  const params = {
    id,
    title: job.title || job.topic,
    prompt: job.topic || job.title,
    script,
    voiceId: job.voice || 'ko-KR-SunHiNeural',
    templateId: job.style || 'basic',
    fontId: job.font || undefined,
    subtitleStyleId: job.subtitleStyle || undefined,
    subtitleFontSize: job.subtitleSize || undefined,
    titleStyleId: job.titleStyle || undefined,
    durationSeconds: Number(job.durationSeconds) || 55,
    bgmMood: job.bgm || 'auto',
    enableBgm: job.bgm !== 'none',
    bgmVolume: job.bgmVolume,
    enableSfx: job.sfx !== false,
    enableHookIntro: Boolean(job.hook?.title || job.hook?.subtitle) || job.hookIntro === true,
    hookTitleText: job.hook?.title,
    hookSubtitleText: job.hook?.subtitle,
    enableKaraoke: job.karaoke === true,
    highlightKeywords: job.highlightKeywords !== false,
    enableStockVideo: job.stockVideo === true,
    voiceSpeed: job.voiceSpeed,
    transitionType: job.transition || 'fade',
    loopMode: job.loopMode === true,
    customScenes: scenes.length ? scenes : undefined,
    ...(job.advanced && typeof job.advanced === 'object' ? job.advanced : {}),
  };

  console.log(`\n🎬 [${slug}] "${params.title}" 제작 시작 (장면 ${scenes.length || '자동'}개, 목소리 ${params.voiceId}, 화풍 ${params.templateId})`);
  let last = -1;
  const result = await engine.executeRenderPipeline(params, (status, progress, message, err) => {
    if (progress !== last || status === 'error') {
      last = progress;
      console.log(`   ${String(progress).padStart(3)}% ${message}${err ? ` - ${err}` : ''}`);
    }
  });
  if (!result?.success || !fs.existsSync(result.videoPath)) throw new Error('영상 파일이 만들어지지 않았습니다');

  // 결과물 정리
  const finalVideo = path.join(outDir, `${slug}.mp4`);
  fs.copyFileSync(result.videoPath, finalVideo);
  if (result.thumbnailPath && fs.existsSync(result.thumbnailPath)) {
    fs.copyFileSync(result.thumbnailPath, path.join(outDir, `${slug}_thumbnail${path.extname(result.thumbnailPath)}`));
  }
  const scriptTxt = path.join(path.dirname(result.videoPath), `${id}_script.txt`);
  if (fs.existsSync(scriptTxt)) fs.copyFileSync(scriptTxt, path.join(outDir, `${slug}_script.txt`));
  const yt = job.youtube || {};
  const ytText = [
    `제목: ${yt.title || params.title}`,
    '',
    '설명:',
    yt.description || '',
    '',
    `태그: ${(yt.tags || []).map((t) => (String(t).startsWith('#') ? t : `#${t}`)).join(' ')}`,
    yt.pinnedComment ? `\n고정 댓글:\n${yt.pinnedComment}` : '',
  ].join('\n');
  fs.writeFileSync(path.join(outDir, 'youtube.txt'), ytText, 'utf8');
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const mb = (fs.statSync(finalVideo).size / 1024 / 1024).toFixed(1);
  console.log(`✅ [${slug}] 완료 → ${path.relative(ROOT, finalVideo)} (${mb}MB)`);
  return { slug, title: params.title, video: finalVideo, outDir };
}

/**
 * GitHub Secrets 로 넘어온 API 키를 엔진 설정 파일(settings.json)에 넣는다. 키는 모두 선택이며,
 * 없으면 무료 엔진(Edge-TTS · 무료 이미지 생성)만 쓴다. 이 파일은 실행 중인 러너 안에만 생긴다.
 */
function writeSettingsFromEnv() {
  const env = process.env;
  const map = {
    geminiApiKey: env.GEMINI_API_KEY,
    openaiApiKey: env.OPENAI_API_KEY,
    elevenlabsApiKey: env.ELEVENLABS_API_KEY,
    pexelsApiKey: env.PEXELS_API_KEY,
    pixabayApiKey: env.PIXABAY_API_KEY,
    falApiKey: env.FAL_API_KEY,
    stabilityApiKey: env.STABILITY_API_KEY,
    imageEngine: env.IMAGE_ENGINE,
  };
  const settings = {
    defaultVoiceId: 'ko-KR-SunHiNeural',
    defaultTemplateId: 'basic',
    ...Object.fromEntries(Object.entries(map).filter(([, v]) => v && String(v).trim())),
  };
  const userData = env.KSHORTS_USER_DATA || path.join(os.homedir(), '.kshorts-factory');
  const dir = path.join(userData, 'kshorts-data');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'settings.json'), JSON.stringify(settings, null, 2), { mode: 0o600 });
  const used = Object.keys(map).filter((k) => k !== 'imageEngine' && settings[k]);
  console.log(`🔑 사용할 API 키: ${used.length ? used.join(', ') : '없음 (무료 엔진만 사용)'}`);
}

/** workflow_dispatch 로 붙여 넣은 job JSON 을 shorts/<slug>/job.json 으로 만든다. */
function writeInlineJob(json, slugHint) {
  const job = JSON.parse(json);
  const base = String(slugHint || job.slug || '').trim() ||
    `${new Date().toISOString().slice(0, 10)}-${Date.now().toString(36)}`;
  const slug = base.replace(/[^A-Za-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'short';
  const dir = path.join(SHORTS_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'job.json'), JSON.stringify(job, null, 2), 'utf8');
  return dir;
}

function collectJobDirs(argv) {
  if (argv.includes('--inline')) {
    return [writeInlineJob(process.env.FACTORY_JOB_JSON || '', process.env.FACTORY_JOB_SLUG)];
  }
  if (argv.includes('--all')) {
    if (!fs.existsSync(SHORTS_DIR)) return [];
    return fs.readdirSync(SHORTS_DIR)
      .filter((n) => !n.startsWith('_') && fs.existsSync(path.join(SHORTS_DIR, n, 'job.json')))
      .map((n) => path.join(SHORTS_DIR, n));
  }
  const listIdx = argv.indexOf('--changed-file');
  const files = listIdx >= 0
    ? fs.readFileSync(argv[listIdx + 1], 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    : argv.filter((a) => !a.startsWith('--'));
  const dirs = new Set();
  for (const f of files) {
    const abs = path.resolve(ROOT, f);
    // shorts/<slug>/ 안의 어떤 파일이 바뀌어도 그 작업을 다시 만든다.
    const rel = path.relative(SHORTS_DIR, abs);
    if (rel.startsWith('..') || path.isAbsolute(rel)) continue;
    const slug = rel.split(path.sep)[0];
    if (!slug || slug.startsWith('_')) continue;
    const dir = path.join(SHORTS_DIR, slug);
    if (fs.existsSync(path.join(dir, 'job.json'))) dirs.add(dir);
  }
  return [...dirs];
}

async function main() {
  const argv = process.argv.slice(2);
  const jobDirs = collectJobDirs(argv);
  if (jobDirs.length === 0) {
    console.log('만들 쇼츠 작업이 없습니다. (shorts/<이름>/job.json)');
    return;
  }
  writeSettingsFromEnv();
  const enginePath = path.join(ROOT, 'dist-factory', 'engine.cjs');
  if (!fs.existsSync(enginePath)) throw new Error('엔진이 빌드되지 않았습니다. 먼저 `node factory/build.mjs` 를 실행하세요.');
  const engine = require(enginePath);

  const results = [];
  for (const dir of jobDirs) {
    try {
      results.push({ ok: true, ...(await renderJob(engine, dir)) });
    } catch (e) {
      fail(`[${path.basename(dir)}] ${e?.message || e}`);
      results.push({ ok: false, slug: slugOf(dir), error: String(e?.message || e) });
    }
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify(results, null, 2));
  console.log(`\n📦 완료 ${results.filter((r) => r.ok).length}편 / 실패 ${results.filter((r) => !r.ok).length}편`);
}

main()
  .catch((e) => fail(e?.message || String(e)))
  // 엔진 안의 타이머(예약 발행 점검 등)가 프로세스를 붙잡지 않도록 끝나면 바로 종료한다.
  .finally(() => setTimeout(() => process.exit(process.exitCode || 0), 200));
