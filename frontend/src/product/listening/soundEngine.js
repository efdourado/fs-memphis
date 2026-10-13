import { eventsAt } from './soundExperiments.js';

const frequency = midi => 440 * 2 ** ((midi - 69) / 12);
const VOICES = {
  softKick: { type: 'sine', volume: .55, decay: .2, drop: 38 },
  dryKick: { type: 'sine', volume: .65, decay: .13, drop: 32 },
  machineKick: { type: 'triangle', volume: .38, decay: .16, drop: 46 },
  tom: { type: 'sine', volume: .35, decay: .22, drop: 65 },
  roundBass: { type: 'triangle', volume: .22, cutoff: 650 },
  sub: { type: 'sine', volume: .4 },
  keys: { type: 'triangle', volume: .13, cutoff: 1700, attack: .012 },
  pluck: { type: 'sawtooth', volume: .1, cutoff: 2100 },
  pad: { type: 'triangle', volume: .105, cutoff: 1000, attack: .15 },
  drone: { type: 'sine', volume: .12, cutoff: 850, attack: .18, sustain: true },
  vowel: { type: 'sawtooth', volume: .2, cutoff: 900, filter: 'bandpass', attack: .018 },
  reed: { type: 'square', volume: .12, cutoff: 1800 },
  bowed: { type: 'sawtooth', volume: .13, cutoff: 1350, attack: .07 },
};

export function createInstrument(ctx, destination) {
  // One reusable noise buffer per context, with no external audio assets.
  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const samples = noise.getChannelData(0);
  let seed = 1234567;
  for (let i = 0; i < samples.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    samples[i] = seed / 2147483648 - 1;
  }
  const play = (event, at) => {
    const percussiveNoise = event.voice === 'snap' || event.voice === 'snare';
    const voice = percussiveNoise
      ? { volume: event.voice === 'snap' ? .19 : .25, decay: event.voice === 'snap' ? .065 : .13, cutoff: event.voice === 'snap' ? 2300 : 1300, filter: 'highpass' }
      : VOICES[event.voice];
    if (!voice) throw new Error(`Unknown sound: ${event.voice}`);
    const duration = voice.decay || Math.max(.06, event.duration);
    const time = at + event.offset;
    const count = event.notes.length;
    event.notes.forEach((note, index) => {
      const source = percussiveNoise ? ctx.createBufferSource() : ctx.createOscillator();
      const gain = ctx.createGain(), filter = ctx.createBiquadFilter(), pan = ctx.createStereoPanner();
      if (percussiveNoise) source.buffer = noise;
      else {
        source.type = voice.type;
        source.frequency.setValueAtTime(voice.drop ? frequency(note) * 2 : frequency(note), time);
        if (voice.drop) source.frequency.exponentialRampToValueAtTime(voice.drop, time + duration);
      }
      filter.type = voice.filter || 'lowpass';
      filter.frequency.setValueAtTime(voice.cutoff || 8000, time);
      filter.Q.value = voice.filter === 'bandpass' ? 3 : .7;
      const position = count > 1 ? (index / (count - 1) * 2 - 1) * event.spread : event.pan;
      pan.pan.setValueAtTime(position, time);
      const level = voice.volume * event.gain / Math.sqrt(count);
      gain.gain.setValueAtTime(.0001, time);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0002, level), time + Math.min(voice.attack || .005, duration / 3));
      if (voice.sustain) gain.gain.setValueAtTime(Math.max(.0002, level), time + duration * .9);
      gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
      source.connect(filter); filter.connect(gain); gain.connect(pan); pan.connect(destination);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); pan.disconnect(); };
      source.start(time); source.stop(time + duration + .01);
    });
  };
  return { play };
}

// Each scheduled step reads the current controls, including tempo. Changes never
// start a second loop or reset the foundation when a listener changes a preset.
export function createSoundEngine(ctx, experiment, readSettings, onStep) {
  const output = ctx.createGain();
  output.gain.value = .42;
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -10; limiter.ratio.value = 8;
  output.connect(limiter); limiter.connect(ctx.destination);
  const instrument = createInstrument(ctx, output);
  let beat = 0, nextTime = ctx.currentTime + .045, timer, stopped = false;
  const queue = [];
  const tick = () => {
    if (stopped) return;
    // Do not catch up a long backlog after a device suspends its audio clock.
    if (nextTime < ctx.currentTime - .15) nextTime = ctx.currentTime + .025;
    while (nextTime < ctx.currentTime + .08) {
      const settings = readSettings();
      const step = beat % 16;
      for (const event of eventsAt(experiment, settings, step, Math.floor(beat / 16))) instrument.play(event, nextTime);
      queue.push({ time: nextTime, step });
      nextTime += 60 / settings.bpm / 4;
      beat++;
    }
    while (queue.length && queue[0].time <= ctx.currentTime) onStep(queue.shift().step);
  };
  return {
    start() { if (timer || stopped) return; tick(); timer = setInterval(tick, 25); },
    stop() {
      if (stopped) return;
      stopped = true; clearInterval(timer); queue.length = 0;
      output.disconnect(); limiter.disconnect();
      if (ctx.state !== 'closed') ctx.close().catch(() => {});
    },
  };
}
