const SAMPLE_RATE = 22050;
const DURATION_SECONDS = 18;
const audioCache = new Map();
const prototypeAudioKeys = new Set([
  'first-light',
  'soft-static',
  'held-in-color',
  'blue-hour',
  'between-stations',
  'shoreline-notes',
  'open-circuit',
  'glass-rhythm',
  'new-signals',
  'paper-moon',
  'low-window',
  'still-writing',
  'quiet-frequency',
  'room-tone',
  'leave-space',
]);

const coverPalettes = [
  ['#ffb347', '#d3544d', '#25172f'],
  ['#62d0ff', '#4869e8', '#171b3f'],
  ['#d78bff', '#8e4ad8', '#241631'],
  ['#6be0bd', '#168f8c', '#102e38'],
  ['#ff7f9f', '#bb4369', '#32182e'],
  ['#f2d16b', '#9e6b37', '#282018'],
];

const hashKey = (value = '') => {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const writeWavHeader = (buffer, dataSize) => {
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
};

export const createPrototypeWav = (key = 'memphis') => {
  const sampleCount = SAMPLE_RATE * DURATION_SECONDS;
  const dataSize = sampleCount * 2;
  const wav = Buffer.allocUnsafe(44 + dataSize);
  const seed = hashKey(key);
  const baseFrequency = 92 + (seed % 62);
  const intervals = [0, 7, 3, 10, 5, 12, 7, 3];

  writeWavHeader(wav, dataSize);

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const noteLength = 1.5;
    const notePosition = time % noteLength;
    const noteIndex = Math.floor(time / noteLength) % intervals.length;
    const frequency = baseFrequency * (2 ** (intervals[noteIndex] / 12));
    const attack = Math.min(1, notePosition / 0.08);
    const release = Math.min(1, (noteLength - notePosition) / 0.28);
    const noteEnvelope = Math.max(0, Math.min(attack, release));
    const globalFade = Math.min(1, time / 0.35, (DURATION_SECONDS - time) / 0.7);
    const pulse = Math.sin(Math.PI * 2 * frequency * time);
    const overtone = Math.sin(Math.PI * 2 * frequency * 2 * time + 0.45);
    const sub = Math.sin(Math.PI * 2 * (frequency / 2) * time + 0.2);
    const shimmer = Math.sin(Math.PI * 2 * (frequency * 3.01) * time) * 0.04;
    const sample = (pulse * 0.42 + overtone * 0.14 + sub * 0.2 + shimmer)
      * noteEnvelope
      * globalFade
      * 0.72;

    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + index * 2);
  }

  return wav;
};

export const createPrototypeCover = (key = 'memphis') => {
  const seed = hashKey(key);
  const [start, middle, end] = coverPalettes[seed % coverPalettes.length];
  const rotation = 18 + (seed % 62);
  const circleX = 28 + (seed % 45);
  const circleY = 24 + ((seed >>> 3) % 48);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="Memphis prototype artwork">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${start}"/>
      <stop offset="0.55" stop-color="${middle}"/>
      <stop offset="1" stop-color="${end}"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
  </defs>
  <rect width="800" height="800" fill="url(#field)"/>
  <circle cx="${circleX}%" cy="${circleY}%" r="210" fill="#fff" fill-opacity=".16" filter="url(#blur)"/>
  <path d="M-80 620 L640 -100 L900 160 L180 880 Z" fill="#fff" fill-opacity=".08" transform="rotate(${rotation} 400 400)"/>
  <circle cx="400" cy="400" r="215" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>
  <circle cx="400" cy="400" r="132" fill="#111" fill-opacity=".14" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
  <circle cx="400" cy="400" r="20" fill="#fff" fill-opacity=".82"/>
  <text x="54" y="82" fill="#fff" fill-opacity=".9" font-family="Arial, sans-serif" font-size="24" letter-spacing="8">MEMPHIS</text>
  <text x="54" y="742" fill="#fff" fill-opacity=".72" font-family="Arial, sans-serif" font-size="18" letter-spacing="5">PROTOTYPE AUDIO</text>
</svg>`;
};

export const getPrototypeAudio = (req, res) => {
  const key = req.params.key || 'memphis';
  if (!prototypeAudioKeys.has(key)) {
    return res.status(404).json({ message: 'Prototype audio not found' });
  }
  if (!audioCache.has(key)) audioCache.set(key, createPrototypeWav(key));
  const wav = audioCache.get(key);

  res.set({
    'Content-Type': 'audio/wav',
    'Content-Length': wav.length,
    'Cache-Control': 'public, max-age=86400',
  });
  res.send(wav);
};

export const getPrototypeCover = (req, res) => {
  res
    .type('image/svg+xml')
    .set('Cache-Control', 'public, max-age=86400')
    .send(createPrototypeCover(req.params.key));
};
