// scripts/generate-sfx.js
// Generates 5 broadcast-grade royalty-free sound effects (SFX) using pure PCM synthesis + FFmpeg

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_SFX_DIR = path.resolve(__dirname, '../public/sfx');
const DIST_SFX_DIR = path.resolve(__dirname, '../dist/sfx');

fs.mkdirSync(PUBLIC_SFX_DIR, { recursive: true });
fs.mkdirSync(DIST_SFX_DIR, { recursive: true });

const SAMPLE_RATE = 44100;

function createWavHeader(dataLength, sampleRate = SAMPLE_RATE, channels = 2) {
  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * 2, 28);
  buffer.writeUInt16LE(channels * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);
  return buffer;
}

function saveSfxMp3(filename, pcmBuffer, dataSize, ffmpegFilter = '') {
  const wavPath = path.join(PUBLIC_SFX_DIR, `${filename}.wav`);
  const publicMp3 = path.join(PUBLIC_SFX_DIR, `${filename}.mp3`);
  const distMp3 = path.join(DIST_SFX_DIR, `${filename}.mp3`);

  const wavHeader = createWavHeader(dataSize, SAMPLE_RATE, 2);
  fs.writeFileSync(wavPath, Buffer.concat([wavHeader, pcmBuffer]));

  const filterParam = ffmpegFilter ? `-af "${ffmpegFilter}"` : '';
  try {
    execSync(`ffmpeg -y -i "${wavPath}" ${filterParam} -c:a libmp3lame -b:a 192k "${publicMp3}"`, { stdio: 'ignore' });
    fs.copyFileSync(publicMp3, distMp3);
    fs.unlinkSync(wavPath);
    console.log(`✅ [SFX Generated]: ${filename}.mp3`);
  } catch (err) {
    console.warn(`[SFX Encode Warning for ${filename}]:`, err.message);
  }
}

// 1. Whoosh: Smooth scene transition sweep (swept bandpass white noise + pan)
function generateWhoosh() {
  const duration = 0.45;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const dataSize = totalSamples * 4;
  const pcm = Buffer.alloc(dataSize);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;

    // Bell curve envelope peaking at 40%
    const env = Math.exp(-Math.pow((progress - 0.4) / 0.18, 2));

    // Dynamic white noise with frequency sweep
    const noise = Math.random() * 2 - 1;
    const sweepTone = Math.sin(2 * Math.PI * (200 + 1200 * Math.pow(progress, 1.8)) * t) * 0.4;
    const sample = (noise * 0.7 + sweepTone) * env * 0.85;

    // Stereo panning from left to right
    const left = sample * (1 - progress * 0.7);
    const right = sample * (0.3 + progress * 0.7);

    pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.floor(left * 32767))), i * 4);
    pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.floor(right * 32767))), i * 4 + 2);
  }

  saveSfxMp3('sfx_whoosh', pcm, dataSize, 'highpass=f=250,lowpass=f=4500,volume=1.4');
}

// 2. Pop: Punchy bubble UI pop sound (rapid sine pitch drop)
function generatePop() {
  const duration = 0.16;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const dataSize = totalSamples * 4;
  const pcm = Buffer.alloc(dataSize);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 32);

    // Rapid pitch drop from 950Hz down to 240Hz
    const freq = 240 + 710 * Math.exp(-t * 45);
    const wave = Math.sin(2 * Math.PI * freq * t);
    const harmonic = Math.sin(4 * Math.PI * freq * t) * 0.25;
    const sample = (wave + harmonic) * env * 0.9;

    const val = Math.max(-32767, Math.min(32767, Math.floor(sample * 32767)));
    pcm.writeInt16LE(val, i * 4);
    pcm.writeInt16LE(val, i * 4 + 2);
  }

  saveSfxMp3('sfx_pop', pcm, dataSize, 'volume=1.3');
}

// 3. Ding: Bright chime / bell for key tips and solutions
function generateDing() {
  const duration = 0.65;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const dataSize = totalSamples * 4;
  const pcm = Buffer.alloc(dataSize);

  // Notes: E6 (1318.5Hz), G#6 (1661.2Hz), B6 (1975.5Hz) chime chord
  const freqs = [1318.5, 1661.2, 1975.5, 2637.0];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 5.5);

    let sample = 0;
    freqs.forEach((f, idx) => {
      sample += Math.sin(2 * Math.PI * f * t) * (0.35 / (idx + 1));
    });

    sample = sample * env * 0.85;
    const val = Math.max(-32767, Math.min(32767, Math.floor(sample * 32767)));
    pcm.writeInt16LE(val, i * 4);
    pcm.writeInt16LE(val, i * 4 + 2);
  }

  saveSfxMp3('sfx_ding', pcm, dataSize, 'volume=1.2');
}

// 4. Boom: Cinematic sub-bass impact for 3-second hooks & shocking twists
function generateBoom() {
  const duration = 0.85;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const dataSize = totalSamples * 4;
  const pcm = Buffer.alloc(dataSize);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Initial punch followed by sub rumble
    const punchEnv = Math.exp(-t * 22);
    const subEnv = Math.exp(-t * 4.2);

    const punchFreq = 160 * Math.exp(-t * 35) + 55;
    const subFreq = 52 * Math.exp(-t * 1.5) + 38;

    const punch = Math.sin(2 * Math.PI * punchFreq * t) * punchEnv * 0.65;
    const sub = Math.sin(2 * Math.PI * subFreq * t) * subEnv * 0.55;
    const noise = (Math.random() * 2 - 1) * punchEnv * 0.15;

    const sample = Math.max(-0.98, Math.min(0.98, punch + sub + noise));
    const val = Math.floor(sample * 32767);
    pcm.writeInt16LE(val, i * 4);
    pcm.writeInt16LE(val, i * 4 + 2);
  }

  saveSfxMp3('sfx_boom', pcm, dataSize, 'volume=1.3');
}

// 5. Glitch: Digital scratch / warning alert
function generateGlitch() {
  const duration = 0.28;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const dataSize = totalSamples * 4;
  const pcm = Buffer.alloc(dataSize);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, t / 0.02) * Math.max(0, 1 - t / duration);

    // Fast modulated square-ish wave + digital noise burst
    const mod = Math.sin(2 * Math.PI * 40 * t) > 0 ? 1 : -0.5;
    const f = (600 + 400 * mod) + (Math.sin(2 * Math.PI * 180 * t) * 200);
    const tone = Math.sin(2 * Math.PI * f * t) > 0 ? 0.4 : -0.4;
    const noise = (Math.random() * 2 - 1) * 0.35;

    const sample = (tone + noise) * env * 0.75;
    const val = Math.max(-32767, Math.min(32767, Math.floor(sample * 32767)));
    pcm.writeInt16LE(val, i * 4);
    pcm.writeInt16LE(val, i * 4 + 2);
  }

  saveSfxMp3('sfx_glitch', pcm, dataSize, 'volume=1.2');
}

console.log('Generating 5 Viral SFX Audio Assets...');
generateWhoosh();
generatePop();
generateDing();
generateBoom();
generateGlitch();
console.log('All 5 SFX generated successfully in public/sfx and dist/sfx!');
