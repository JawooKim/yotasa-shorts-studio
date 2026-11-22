// scripts/generate-bgm.js
// Generates 5 broadcast-quality royalty-free background music loops using PCM synthesis + FFmpeg

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BGM_DIR = path.resolve(__dirname, '../public/bgm');
fs.mkdirSync(BGM_DIR, { recursive: true });

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

function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function synthTone(freq, t, type = 'piano') {
  if (type === 'piano') {
    return (
      Math.sin(2 * Math.PI * freq * t) * 0.6 +
      Math.sin(4 * Math.PI * freq * t) * 0.25 +
      Math.sin(6 * Math.PI * freq * t) * 0.15
    );
  }
  if (type === 'pad') {
    return (
      Math.sin(2 * Math.PI * freq * t) * 0.5 +
      Math.sin(2 * Math.PI * (freq * 1.003) * t) * 0.3 +
      Math.sin(4 * Math.PI * freq * t) * 0.2
    );
  }
  if (type === 'sub') {
    return Math.sin(2 * Math.PI * freq * t) * 0.8 + Math.sin(4 * Math.PI * freq * t) * 0.2;
  }
  return Math.sin(2 * Math.PI * freq * t);
}

function generateTrack(filename, moodConfig) {
  const { durationSec, bpm, chordProgression, style } = moodConfig;
  const totalSamples = Math.floor(durationSec * SAMPLE_RATE);
  const dataSize = totalSamples * 4;
  const pcm = Buffer.alloc(dataSize);

  const beatSec = 60 / bpm;
  const chordLenSec = beatSec * 4;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const currentChordIndex = Math.floor((t % (chordProgression.length * chordLenSec)) / chordLenSec);
    const chord = chordProgression[currentChordIndex];
    const chordTime = t % chordLenSec;

    let left = 0;
    let right = 0;

    // 1. Chords
    const chordEnv = Math.min(1, chordTime / 0.1) * Math.max(0, 1 - (chordTime / chordLenSec) * 0.4);
    chord.notes.forEach((midi, idx) => {
      const freq = midiToFreq(midi);
      const tone = synthTone(freq, t, style.leadStyle) * chordEnv * 0.12;
      const pan = (idx - 1) * 0.25;
      left += tone * (0.5 - pan * 0.4);
      right += tone * (0.5 + pan * 0.4);
    });

    // 2. Bassline
    const bassMidi = chord.bass || (chord.notes[0] - 12);
    const bassFreq = midiToFreq(bassMidi);
    const beatTime = t % beatSec;
    const bassEnv = Math.exp(-beatTime * 3.5);
    const bassTone = synthTone(bassFreq, t, 'sub') * bassEnv * 0.18;
    left += bassTone * 0.5;
    right += bassTone * 0.5;

    // 3. Subtle Rhythm
    if (style.hasKick && beatTime < 0.15) {
      const kickFreq = 120 * Math.exp(-beatTime * 28) + 45;
      const kick = Math.sin(2 * Math.PI * kickFreq * beatTime) * Math.exp(-beatTime * 18) * 0.2;
      left += kick;
      right += kick;
    }

    if (style.hasShaker) {
      const sixteenth = t % (beatSec / 4);
      if (sixteenth < 0.04) {
        const noise = (Math.random() * 2 - 1) * Math.exp(-sixteenth * 80) * 0.04;
        left += noise * 0.6;
        right += noise * 0.4;
      }
    }

    left = Math.max(-0.95, Math.min(0.95, left));
    right = Math.max(-0.95, Math.min(0.95, right));

    const leftInt16 = Math.floor(left * 32767);
    const rightInt16 = Math.floor(right * 32767);

    pcm.writeInt16LE(leftInt16, i * 4);
    pcm.writeInt16LE(rightInt16, i * 4 + 2);
  }

  const wavPath = path.join(BGM_DIR, `${filename}.wav`);
  const mp3Path = path.join(BGM_DIR, `${filename}.mp3`);

  const wavHeader = createWavHeader(dataSize, SAMPLE_RATE, 2);
  fs.writeFileSync(wavPath, Buffer.concat([wavHeader, pcm]));

  try {
    execSync(`ffmpeg -y -i "${wavPath}" -af "volume=1.2,lowpass=f=12000" -c:a libmp3lame -b:a 192k "${mp3Path}"`, {
      stdio: 'ignore',
    });
    fs.unlinkSync(wavPath);
    console.log(`[BGM Generated]: ${filename}.mp3 (${durationSec}s)`);
  } catch (err) {
    console.warn(`[BGM Encode Warning for ${filename}]:`, err.message);
  }
}

console.log('Generating 5 Category-Optimized Royalty-Free BGM Loops...');

generateTrack('bgm_upbeat', {
  durationSec: 32,
  bpm: 116,
  chordProgression: [
    { notes: [60, 64, 67, 72], bass: 36 },
    { notes: [59, 62, 67, 71], bass: 35 },
    { notes: [57, 60, 64, 69], bass: 33 },
    { notes: [53, 57, 60, 65], bass: 29 },
  ],
  style: { leadStyle: 'piano', hasKick: true, hasShaker: true },
});

generateTrack('bgm_suspense', {
  durationSec: 36,
  bpm: 80,
  chordProgression: [
    { notes: [50, 53, 57, 62], bass: 26 },
    { notes: [46, 50, 53, 58], bass: 22 },
    { notes: [43, 46, 50, 55], bass: 19 },
    { notes: [45, 49, 52, 57], bass: 21 },
  ],
  style: { leadStyle: 'pad', hasKick: false, hasShaker: false },
});

generateTrack('bgm_lofi', {
  durationSec: 36,
  bpm: 78,
  chordProgression: [
    { notes: [50, 54, 57, 61], bass: 26 },
    { notes: [47, 50, 54, 57], bass: 23 },
    { notes: [43, 47, 50, 54], bass: 19 },
    { notes: [45, 49, 52, 55], bass: 21 },
  ],
  style: { leadStyle: 'pad', hasKick: true, hasShaker: true },
});

generateTrack('bgm_epic', {
  durationSec: 32,
  bpm: 120,
  chordProgression: [
    { notes: [57, 60, 64, 69], bass: 33 },
    { notes: [53, 57, 60, 65], bass: 29 },
    { notes: [60, 64, 67, 72], bass: 36 },
    { notes: [55, 59, 62, 67], bass: 31 },
  ],
  style: { leadStyle: 'pad', hasKick: true, hasShaker: false },
});

generateTrack('bgm_tech', {
  durationSec: 32,
  bpm: 112,
  chordProgression: [
    { notes: [54, 57, 61, 66], bass: 30 },
    { notes: [50, 54, 57, 62], bass: 26 },
    { notes: [57, 61, 64, 69], bass: 33 },
    { notes: [52, 56, 59, 64], bass: 28 },
  ],
  style: { leadStyle: 'piano', hasKick: true, hasShaker: true },
});

console.log('All 5 BGM tracks generated successfully!');
