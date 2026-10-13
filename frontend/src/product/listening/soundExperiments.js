// Original musical exercises. None of these patterns transcribe the recordings.
const hit = (step, notes, beats = .5, gain = 1) => ({ step, notes: [].concat(notes), beats, gain });
const rhythm = (steps, notes, beats = .5) => steps.map(step => hit(step, notes, beats));
const part = (id, name, voice, hits, options = {}) => ({ id, name, voice, hits, ...options });

export const soundExperiments = {
  dreams: {
    title: 'Same groove. A bigger room.',
    instruction: 'Move from verse to chorus. The drums, bass and chords stay put; shimmer and harmonies open up the space. Then narrow the stereo image and listen again.',
    control: { id: 'width', label: 'Stereo width', low: 'Close together', high: 'Spread out', initial: 75 },
    tip: 'Headphones make the width change easier to hear. These are original synth textures, not the record’s guitars or vocals.',
    parts: [
      part('drums', 'Soft drums', 'softKick', rhythm([0, 4, 8, 12], 48)),
      part('bass', 'Warm bass', 'roundBass', [hit(0, 45, 1.5), hit(6, 52), hit(8, 47, 1.5), hit(14, 54)]),
      part('keys', 'Soft keys', 'keys', [hit(0, [57, 60, 64], 1.7), hit(8, [59, 62, 66], 1.7)]),
      part('shimmer', 'Guitar-like shimmer', 'pluck', [hit(2, 76), hit(6, 72), hit(10, 78), hit(14, 74)], { spread: true }),
      part('harmony', 'Harmony pad', 'pad', [hit(0, [69, 72, 76], 1.9), hit(8, [71, 74, 78], 1.9)], { spread: true }),
    ],
    presets: [
      { id: 'verse', name: 'Verse', bpm: 112, enabled: ['drums', 'bass', 'keys'], note: 'A close, steady foundation. Keep your attention on the bass and drums.' },
      { id: 'lift', name: 'Lift', bpm: 112, enabled: ['drums', 'bass', 'keys', 'shimmer'], note: 'The same foundation, with a bright part at the edges. Nothing underneath has changed.' },
      { id: 'chorus', name: 'Chorus', bpm: 112, enabled: ['drums', 'bass', 'keys', 'shimmer', 'harmony'], note: 'Harmonies fill the upper space. Move the width slider to hear the room close and reopen.' },
    ],
  },
  'bad-guy': {
    title: 'Who gets to be the hook?',
    instruction: 'Trade the voice-like lead for a synth riff. Then switch to a slower, heavier ending. Try turning both leads on: does the extra part help, or compete?',
    tip: 'The voice-like lead is a synthesized tone, not a singer or a voice sample. The riffs and drum patterns were written for this exercise.',
    parts: [
      part('kick', 'Dry kick', 'dryKick', rhythm([0, 6, 8, 11], 43, .35)),
      part('bass', 'Short bass', 'sub', [hit(0, 36, .7), hit(3, 36, .3), hit(6, 39, .5), hit(8, 36, .7), hit(11, 43, .4), hit(14, 39, .4)]),
      part('snaps', 'Finger-snap texture', 'snap', rhythm([4, 12], 80, .15)),
      part('voice', 'Voice-like lead', 'vowel', [hit(1, 60, .45), hit(4, 63, .4), hit(7, 60, .65), hit(10, 58, .4), hit(13, 55, .55)]),
      part('riff', 'Playful synth riff', 'reed', [hit(0, 72, .25), hit(2, 67, .25), hit(5, 70, .4), hit(8, 75, .25), hit(10, 70, .25), hit(13, 67, .6)]),
      part('weight', 'Long sub tail', 'sub', [hit(0, 29, 2.8), hit(12, 31, .8)]),
    ],
    presets: [
      { id: 'voice', name: 'Voice in front', bpm: 135, enabled: ['kick', 'bass', 'snaps', 'voice'], note: 'Short bass and dry percussion leave the voice-like melody exposed.' },
      { id: 'riff', name: 'Riff takes over', bpm: 135, enabled: ['kick', 'bass', 'riff'], note: 'The voice and snaps leave. The new melody gets their space, without adding a wall of sound.' },
      { id: 'ending', name: 'Slow the ending', bpm: 120, enabled: ['kick', 'weight', 'voice'], note: 'The clock slows from 135 to 120 BPM. A longer, deeper bass replaces the short pattern.' },
    ],
  },
  'running-up-that-hill': {
    title: 'The machine holds. The accents break through.',
    instruction: 'Build a repeating machine pulse, hold a chord underneath it, then bring in played-style fills. Keep the machine fixed while you loosen the accents.',
    control: { id: 'humanize', label: 'Accent looseness', low: 'On the grid', high: 'Loose & varied', initial: 65 },
    tip: 'The fills imitate timing and touch with synthesis. No live performance or original sampler recording is used.',
    parts: [
      part('machine', 'Machine pulse', 'machineKick', rhythm([0, 3, 6, 8, 10, 14], 45, .4)),
      part('backbeat', 'Gated backbeat', 'snare', rhythm([4, 12], 70, .3)),
      part('motif', 'Bowed synth motif', 'bowed', [hit(0, 65, .6), hit(3, 68, .5), hit(6, 72, .6), hit(10, 67, .9)]),
      part('drone', 'Suspended drone', 'drone', [hit(0, [53, 60, 65], 4)]),
      part('fills', 'Played-style toms', 'tom', [hit(7, 57, .35, .65), hit(11, 55, .35, .75), hit(13, 52, .4), hit(14, 48, .45, .8), hit(15, 45, .6)], { human: true }),
      part('guitar', 'Guitar-like answer', 'pluck', [hit(6, [72, 77], .9), hit(14, [70, 75], 1.1)], { human: true, spread: true }),
    ],
    presets: [
      { id: 'machine', name: 'Machine only', bpm: 108, enabled: ['machine', 'backbeat', 'motif'], note: 'The same precise pulse and motif return every bar. There are no fills to release the tension.' },
      { id: 'suspended', name: 'Hold the tension', bpm: 108, enabled: ['machine', 'backbeat', 'motif', 'drone'], note: 'A sustained chord sits underneath the repeating pattern. The pulse stays exactly as it was.' },
      { id: 'release', name: 'Let the accents in', bpm: 108, enabled: ['machine', 'backbeat', 'motif', 'drone', 'fills', 'guitar'], note: 'Toms and a plucked answer interrupt the repetition. Accent looseness changes their timing and touch, not the machine.' },
    ],
  },
};

export const experimentFor = slug => soundExperiments[slug];
export const settingsFor = (experiment, preset = experiment.presets[0]) => ({
  presetId: preset.id, bpm: preset.bpm, enabled: [...preset.enabled], amount: experiment.control?.initial ?? 0,
});

// Pure score planning shared by playback and tests. Timing variation is bounded
// and deterministic; machine parts never inherit the played-style offsets.
export function eventsAt(experiment, settings, step, bar = 0) {
  const quarter = 60 / settings.bpm;
  return experiment.parts.flatMap(layer => {
    if (!settings.enabled.includes(layer.id)) return [];
    return layer.hits.filter(event => event.step === step).map(event => {
      const variation = Math.sin((bar + 1) * 17 + step * 7);
      const looseness = layer.human ? settings.amount / 100 : 0;
      const width = layer.spread ? (experiment.control?.id === 'width' ? settings.amount / 100 : .65) : 0;
      return {
        partId: layer.id, voice: layer.voice, notes: event.notes,
        duration: event.beats * quarter,
        gain: event.gain * (1 - looseness * (.16 + variation * .12)),
        offset: looseness * (.018 + variation * .016),
        pan: width * (step % 8 < 4 ? -.85 : .85),
        spread: width,
      };
    });
  });
}
