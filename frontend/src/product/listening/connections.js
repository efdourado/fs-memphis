import { experimentFor, settingsFor } from './soundExperiments.js';

// Editorial pairings of our original sketches, not claims of artist influence
// or controlled comparisons of the recordings. Each keeps its own tempo/timbre.
export const connections = [
  {
    id: 'make-space', theme: 'Space', title: 'Two ways to make a small sound feel big.',
    invitation: 'One opens the edges. One clears the center. Where does your attention go?',
    question: 'Which kind of space draws you in?',
    sides: [
      { slug: 'dreams', preset: 'chorus', label: 'Open the room', cue: 'Follow the steady bass. Notice the harmony and shimmer around it.', detail: 'In this sketch, the foundation stays close while the upper parts spread out. Try headphones for the contrast.', mark: 'Widen the edges' },
      { slug: 'bad-guy', preset: 'riff', label: 'Clear the center', cue: 'Follow the short riff. Notice how little has to surround it.', detail: 'The voice-like part and snaps leave this sketch. A new melody gets the space they occupied.', mark: 'Give one part the floor' },
    ],
    choices: [
      { id: 'width', label: 'The sound opening around me', takeaway: 'Let the center stay familiar. Change the edges.', prompt: 'On your next chorus, follow the bass first, then the sounds furthest to each side. Which parts make the room feel larger?' },
      { id: 'space', label: 'One detail with room to stand out', takeaway: 'Make space before adding another part.', prompt: 'On your next hook, pick out its smallest memorable sound. What stops playing so you can hear it clearly?' },
      { id: 'both', label: 'The contrast between the two', takeaway: 'A bigger moment can come from adding or removing.', prompt: 'Listen to a verse and its chorus. Name one part that arrives and one that leaves. Which change matters more to you?' },
    ],
    reading: 'Our thread is attention. The Dreams exercise makes its frame wider; the bad guy exercise gives a single idea more room. “Bigger” can describe a feeling without describing the number of parts.',
    challenge: 'Start with any short loop. Make one version wider and another emptier. Keep the same focal point in both.',
  },
  {
    id: 'keep-the-pulse', theme: 'Repetition', title: 'The same return. A different feeling.',
    invitation: 'A repeating pattern can hold you gently or keep you on edge. Listen to what happens around it.',
    question: 'What do you want a repeating pulse to do?',
    sides: [
      { slug: 'dreams', preset: 'verse', label: 'Let it float', cue: 'Follow the round bass and soft pulse as the short pattern comes back.', detail: 'Three parts share a steady frame. Our Dreams sketch keeps the arrangement close and leaves the surrounding space open.', mark: 'A familiar place to land' },
      { slug: 'running-up-that-hill', preset: 'release', label: 'Push against it', cue: 'Stay with the machine pulse while the toms and plucked accents interrupt it.', detail: 'The machine pattern repeats precisely; the added accents vary slightly in timing and touch.', mark: 'A frame to push against' },
    ],
    choices: [
      { id: 'settle', label: 'Give me somewhere to settle', takeaway: 'Repetition can be a place to return to.', prompt: 'Follow just the bass through a whole verse. When another part changes, does the familiar pattern make it feel calmer or stronger?' },
      { id: 'restless', label: 'Keep a little restlessness alive', takeaway: 'A steady frame makes a loose accent feel alive.', prompt: 'Listen for an accent that seems to lean away from the beat. Does it feel expressive because something else stays steady?' },
      { id: 'both', label: 'Let it do both at once', takeaway: 'A loop can anchor a song without fixing its mood.', prompt: 'Pick one repeating part and one changing part. Follow their relationship instead of either sound on its own.' },
    ],
    reading: 'Our thread is the frame. A repeated part gives you a reference point; the sounds around it can soften that frame or push against it. These sketches use different patterns and tones, so this is an invitation to listen, not a test of one isolated variable.',
    challenge: 'Keep a four-bar foundation unchanged. Make one pass feel settled and one restless using only an added accent.',
  },
  {
    id: 'change-the-ending', theme: 'Endings', title: 'Keep the ground. Or move it.',
    invitation: 'Two ending ideas: let the accents break through, or slow the world down.',
    question: 'Which ending would you want to stay inside?',
    sides: [
      { slug: 'running-up-that-hill', preset: 'release', label: 'Let the pressure out', cue: 'Listen for the accents breaking through an unchanging machine pulse.', detail: 'The pulse holds at 108 BPM in this sketch. Toms and a plucked answer add motion around it.', mark: 'Change what surrounds the pulse' },
      { slug: 'bad-guy', preset: 'ending', label: 'Change the ground', cue: 'Notice the long, low bass and the space between the hits.', detail: 'This is the 120 BPM ending scene of our bad guy exercise, down from its 135 BPM opening. To hear that transition, open the full experiment below.', mark: 'Change the weight and the clock' },
    ],
    choices: [
      { id: 'release', label: 'The familiar pulse breaking open', takeaway: 'An ending can release energy without changing its foundation.', prompt: 'Near the end of your next song, follow the drums. Does the pattern change, or do new accents change how it feels?' },
      { id: 'turn', label: 'A sudden change of weight', takeaway: 'A different ending can begin with a different sense of time.', prompt: 'Find an ending that seems to enter another room. Listen for changes in pace, bass length and the gaps between sounds.' },
      { id: 'both', label: 'A little of each', takeaway: 'The ending is another arrangement decision.', prompt: 'Imagine two endings for a song you know: one that adds accents, and one that changes pace. Which would change your memory of it?' },
    ],
    reading: 'Our thread is expectation. One exercise lets new accents emerge over the machine; the other makes the rhythm slower and the bass longer. These are two ways to rethink an ending, not rules about how an ending should feel.',
    challenge: 'Give the same loop two endings. First, keep its pulse and add an answer. Then change the tempo and leave a longer bass tail.',
  },
];

export const connectionFor = id => connections.find(connection => connection.id === id);
export const connectionsForSong = slug => connections.filter(connection => connection.sides.some(side => side.slug === slug));
export const choiceFor = (id, choiceId) => connectionFor(id)?.choices.find(choice => choice.id === choiceId);
export function soundForSide(side) {
  const experiment = experimentFor(side.slug);
  const preset = experiment?.presets.find(item => item.id === side.preset);
  return preset ? { experiment, settings: settingsFor(experiment, preset) } : null;
}

export function sanitizeDiscoveries(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter(item => {
    if (!item || !choiceFor(item.id, item.choiceId) || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).map(item => ({ id: item.id, choiceId: item.choiceId, note: typeof item.note === 'string' ? item.note.slice(0, 1000) : '' }));
}
