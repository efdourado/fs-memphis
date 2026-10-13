// The full pages: how each song was made, a map of what plays when, and
// things to try. Facts marked `verified` come from the song's Wikipedia
// article (reviewed 2026-10-12). The maps were placed by ear and say so.
//
// Map cells: 0 silent, 1 quiet, 2 playing, 3 on the record but placement not documented.

const fact = (label, body) => ({ label, body, status: 'verified', sourceId: 'wiki' });
const take = (label, body) => ({ label, body, status: 'editorial' });
const figure = (value, label, status = 'verified') => ({ value, label, status, sourceId: status === 'verified' ? 'wiki' : '' });
const layer = (name, status, cells) => ({ name, status, cells });

const BY_EAR = 'Placed by ear. The chords and the instruments are documented; where each one enters is our reading.';

export const hooks = {
  'running-up-that-hill': 'A drum pattern she sang out loud',
  dreams: 'Three chords, three rooms',
  'bad-guy': 'A riff for a chorus',
  'birds-of-a-feather': 'The slow climb',
  espresso: 'A borrowed groove',
  'blinding-lights': '1985, built in 2019',
  'cant-feel-my-face': 'Sounding like a hero',
  'baby-one-more-time': 'Three notes and you know',
  'teenage-dream': 'Five writers, one rush',
  'die-young': 'A hit, interrupted',
};

export const deep = {
  dreams: {
    idea: 'Three chords that never change, and a band that makes them sound like three different songs.',
    figures: [
      figure('3', 'chords, by Christine McVie’s count'),
      figure('8', 'bars in the drum loop'),
      figure('10', 'lead vocal takes recorded'),
      figure('10 min', 'to write, Stevie Nicks says'),
      figure('43', 'years until it charted again', 'computed'),
    ],
    making: [
      fact('Written in ten minutes', 'Early 1976, at the Record Plant in Sausalito. Stevie Nicks found “a black-and-red room, with a sunken pit” and a piano she believed belonged to Sly Stone, sat at a Fender Rhodes and wrote the song “in about 10 minutes”.'),
      fact('A song the band found boring', 'Christine McVie heard the rough version and called it “just three chords and one note in the left hand”.'),
      fact('Same chords, three rooms', 'Lindsey Buckingham kept the chords and built three sections out of them, each made to sound different. That won McVie over.'),
      fact('A loop before loops were normal', 'Producer Ken Caillat cut eight bars of Mick Fleetwood’s drumming into a loop, for what he called a “deep hypnotic effect”.'),
      fact('The first vocal stayed', 'Nicks recorded ten lead takes. The one on the record is the guide vocal, with a few lines punched in.'),
      fact('Width from very little', 'The electric guitars were sent through four signals and spread across the stereo field. Buckingham worked out the chorus harmonies as triads on a piano; they were sung in three parts, then doubled.'),
    ],
    glossary: [
      { term: 'Guide vocal', body: 'A quick take sung so the band can follow the song while recording. It’s usually replaced later.' },
      { term: 'Punch in', body: 'Re-recording just one line and dropping it into an existing take.' },
      { term: 'Loop', body: 'A short recording repeated end to end, so the feel never changes.' },
    ],
    map: {
      sections: ['intro', 'verse', 'pre', 'chorus', 'break', 'verse', 'pre', 'chorus', 'out'],
      layers: [
        layer('Drum loop', 'verified', [2, 2, 2, 2, 2, 2, 2, 2, 2]),
        layer('Bass', 'editorial', [2, 2, 2, 2, 2, 2, 2, 2, 2]),
        layer('Guitars, wide', 'verified', [1, 1, 2, 2, 2, 1, 2, 2, 2]),
        layer('Tom accents', 'verified', [0, 0, 2, 2, 1, 1, 2, 2, 1]),
        layer('Vibraphone', 'verified', [0, 0, 2, 0, 0, 0, 2, 0, 0]),
        layer('Lead vocal', 'editorial', [0, 2, 2, 2, 0, 2, 2, 2, 1]),
        layer('Harmonies ×3', 'verified', [0, 0, 0, 2, 0, 0, 0, 2, 1]),
        layer('Congas', 'verified', [3, 3, 3, 3, 3, 3, 3, 3, 3]),
      ],
      note: BY_EAR,
    },
    moments: [
      fact('0:48', 'Tom accents enter. The loop has been running untouched until here.'),
      fact('Pre-chorus', 'A vibraphone played through a delay, low in the mix.'),
      take('Chorus', 'The only place all three voices sing. Try following the lowest one.'),
    ],
    why: [
      'Most songs change chords to tell you a new section has started. Dreams can’t, so it changes the room instead: a new instrument, a wider guitar, more voices. Your ear reads that as movement.',
      'The loop does the opposite job. It never reacts to anything, which is why the song feels calm even when the words aren’t.',
    ],
    tryIt: [
      { title: 'Three sections, same chords', body: 'Take a two or three chord loop. Write a verse, a lift and a chorus over it without changing harmony. Only add, remove or widen parts.' },
      { title: 'Loop your best eight bars', body: 'Find the eight bars where the drummer sits best and repeat them for the whole song. Add accents on top by hand, like the toms at 0:48.' },
      { title: 'Keep the guide', body: 'Record the scratch vocal properly. Before replacing it, check whether the feel is already there and only fix the lines that need it.' },
    ],
    versions: [
      fact('The Corrs, 1998', 'Recorded close to the original for the tribute album Legacy, then turned into a dance track with violin and tin whistle by Oliver Leiber and remixed by Todd Terry. No. 6 in the UK.'),
      fact('Deep Dish with Stevie Nicks, 2006', 'An electronica remake with new vocals from Nicks herself. A top-20 UK hit.'),
      fact('Jolyon Petch, 2021', 'A club version that reached No. 1 on Australia’s ARIA Club Tracks chart.'),
      take('What to hear', 'All three add a beat the original never had. The three chords survive every time.'),
    ],
    recorded: 'Recorded in 1976 at Record Plant, Sausalito, and Wally Heider’s Studio 3, Hollywood. Length 4:14.',
  },

  'bad-guy': {
    idea: 'A number one with almost nothing in it: bass, a kick, finger snaps and a voice kept close.',
    figures: [
      figure('4', 'sounds carry the production'),
      figure('135 → 120', 'BPM, it slows for the ending'),
      figure('3:14', 'long'),
      figure('2', 'writers, in one family'),
      figure('19', 'weeks of “Old Town Road” it ended'),
    ],
    making: [
      fact('Two people', 'Billie Eilish wrote it with her brother Finneas O’Connell in 2018. He produced it and she added production. Rob Kinelski mixed it and John Greenham mastered it.'),
      fact('Four sounds', 'The production is built from synth bass, a kick drum, amplified finger snaps and 808 bass. That’s nearly the whole record.'),
      fact('The riff is the chorus', 'Where a sung chorus would go there’s a synth riff, which critics called “goofy carnival” and “cartoony”. The words around it are half-spoken, ending on “duh”.'),
      fact('A crossing signal from Sydney', 'One sound is an Australian pedestrian signal. Eilish recorded it on her phone in February 2017.'),
      fact('Two tempos', 'The song has two halves. The first runs at 135 BPM, the second at 120.'),
      fact('Where it came from', 'Eilish named “Never” by JID and “Stuck in the Mud” by Isaiah Rashad as influences on the writing.'),
      { label: 'The chords', body: 'Reported as G minor, moving Gm–Cm–D7. The published source for this is weak, so check it against your own ears.', status: 'awaiting' },
    ],
    glossary: [
      { term: '808', body: 'A deep, long bass note, named after the Roland TR-808 drum machine it first came from.' },
      { term: 'BPM', body: 'Beats per minute. 120 is a brisk walk; 135 is a jog.' },
      { term: 'Hook', body: 'The part you remember. Usually sung, but it doesn’t have to be.' },
    ],
    map: {
      sections: ['intro', 'verse', 'pre', 'riff', 'verse', 'pre', 'riff', 'slow end'],
      layers: [
        layer('Kick', 'verified', [2, 2, 2, 2, 2, 2, 2, 1]),
        layer('Synth bass', 'verified', [2, 2, 2, 2, 2, 2, 2, 0]),
        layer('Finger snaps', 'verified', [1, 2, 2, 0, 2, 2, 0, 0]),
        layer('Synth riff', 'verified', [0, 0, 0, 2, 0, 0, 2, 0]),
        layer('Lead vocal', 'editorial', [1, 2, 2, 0, 2, 2, 0, 2]),
        layer('808 bass', 'verified', [0, 0, 0, 1, 0, 0, 1, 2]),
        layer('Crossing signal', 'verified', [3, 3, 3, 3, 3, 3, 3, 3]),
      ],
      note: BY_EAR,
    },
    moments: [
      fact('The riff', 'Wait for the chorus and notice that nobody sings one. The synth line takes its place.'),
      fact('The slow end', 'The tempo drops from 135 to 120 BPM and the song becomes something heavier.'),
      take('The voice', 'It sits right at the front and stays quiet. Turn it up and you’ll hear breaths and mouth sounds left in.'),
    ],
    why: [
      'With only four sounds, each one is huge. There’s nothing for the bass to compete with, so it can be the melody, the rhythm and the weight at once.',
      'Keeping the voice quiet and close makes the listener lean in. Loudness would have filled the space the arrangement worked to leave empty.',
    ],
    tryIt: [
      { title: 'Four sounds only', body: 'Finish a section using four sounds and nothing else. When it feels thin, change a part instead of adding one.' },
      { title: 'Let a riff be the chorus', body: 'Mute your chorus vocal and write an instrumental line that does its job. See which one people hum afterwards.' },
      { title: 'Change tempo once, late', body: 'Write a final section 10 to 15 BPM slower than the rest. Keep one element from before so it still sounds like the same song.' },
      { title: 'Record the street', body: 'Capture one sound on your phone this week and put it in a track where a drum or an effect would normally go.' },
    ],
    versions: [
      fact('Remix with Justin Bieber, July 2019', 'Bieber adds autotuned, rap-inspired vocals, runs in the intro and a part in the second verse.'),
      fact('Bastille, 2019', 'A live medley at the BBC’s Maida Vale Studios, with guitars and backing singers added.'),
      fact('The Interrupters', 'A ska punk cover, used in season 2 of The Umbrella Academy.'),
      fact('Ramin Djawadi', 'A solo piano cover, used in season 4 of Westworld.'),
      take('What to hear', 'Every cover adds instruments. Notice how quickly it stops sounding like Bad Guy when the space fills up.'),
    ],
    recorded: 'Recorded in 2018. Length 3:14.',
  },

  'running-up-that-hill': {
    idea: 'It began as a riff on a sampler and a drum pattern she sang out loud.',
    figures: [
      figure('1', 'evening to write'),
      figure('8', 'tracks on the demo recorder'),
      figure('4:58', 'long'),
      figure('37', 'years to reach No. 1 in the UK'),
      figure('8', 'countries where it hit No. 1 in 2022'),
    ],
    making: [
      fact('A room in the country', 'In 1983 Kate Bush moved to rural Sevenoaks and set up a writing room with a piano, a Fairlight CMI and an eight-track recorder. This was the first song she wrote for Hounds of Love, in a single evening.'),
      fact('Riff first, then a sung drum part', 'The song began with the Fairlight riff. She sang a drum pattern to Del Palmer, who programmed it into a LinnDrum. She said the first verse’s lyrics “came straight away”.'),
      fact('The demo became the record', 'She recorded a demo on eight-track. In early 1984 it was transferred to 24-track at her East Wickham Farm studio, where the riff was refined and parts, including the vocals, were recorded again with Palmer and engineers Paul Hardiman and Haydn Bendall.'),
      fact('A cello that used to be a harp', 'The main riff is a sampled cello on the Fairlight. It replaced a harp sound she found too noisy.'),
      fact('A frozen chord', 'The drone under the song was made by “freezing” a chord in a Quantec digital reverb.'),
      fact('People on top of the machine', 'Stuart Elliott overdubbed a snare to strengthen the LinnDrum’s and added fills at the end. Palmer played a “pulsing” bassline. Alan Murphy added guitar for the ending and Paddy Bush played balalaika.'),
      fact('The title', 'She called it “A Deal with God”. EMI thought that could cost it radio play. She agreed to change it, to “give the album a chance”.'),
      fact('The notes', 'It’s in C minor. The vocal melody leans on the minor seventh, which creates tension. On the word “could” she sings a major seventh over an A-flat major chord.'),
    ],
    glossary: [
      { term: 'Fairlight CMI', body: 'An early sampler. It records a sound and lets you play it back as notes on a keyboard.' },
      { term: 'LinnDrum', body: 'A 1980s drum machine that plays recordings of real drums in a pattern you program.' },
      { term: 'Drone', body: 'One sustained sound held under everything else.' },
      { term: 'Overdub', body: 'A part recorded later on top of what’s already there.' },
    ],
    map: {
      sections: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'out'],
      layers: [
        layer('LinnDrum pattern', 'verified', [2, 2, 2, 2, 2, 2, 2, 2]),
        layer('Frozen-chord drone', 'verified', [2, 2, 2, 2, 2, 2, 2, 2]),
        layer('Fairlight cello riff', 'verified', [2, 1, 2, 1, 2, 1, 2, 2]),
        layer('Pulsing bass', 'verified', [1, 2, 2, 2, 2, 2, 2, 2]),
        layer('Lead vocal', 'editorial', [0, 2, 2, 2, 2, 2, 2, 1]),
        layer('Backing voices', 'editorial', [0, 0, 2, 0, 2, 2, 2, 2]),
        layer('Real drum fills', 'verified', [0, 0, 0, 0, 0, 0, 0, 2]),
        layer('Guitar', 'verified', [0, 0, 0, 0, 0, 0, 0, 2]),
        layer('Balalaika', 'verified', [3, 3, 3, 3, 3, 3, 3, 3]),
      ],
      note: BY_EAR,
    },
    moments: [
      fact('From the first second', 'The sound that never stops is one chord, frozen in a reverb.'),
      fact('On the word “could”', 'A major seventh over A-flat major. It’s the brightest, most hopeful note in the melody.'),
      fact('The ending', 'Real drum fills and a guitar arrive only here. Until now the rhythm has been a machine.'),
    ],
    why: [
      'The drum pattern never plays a fill, so nothing ever lets the tension go. The song keeps running, like its title.',
      'The melody leans on a note that wants to resolve and doesn’t. It matches a lyric about wanting something you can’t have. When humans finally play at the end, it feels like the release the machine refused to give.',
    ],
    tryIt: [
      { title: 'Sing the drums first', body: 'Before touching a drum machine, sing or beatbox the pattern into your phone. Program what you sang, not what the grid suggests.' },
      { title: 'Freeze a chord', body: 'Play one chord into a reverb with a freeze or infinite setting and keep it under the whole song as a drone.' },
      { title: 'Change the sound, not the notes', body: 'If a part feels wrong, try the same notes on a different instrument before rewriting it. A harp became a cello here.' },
      { title: 'Save the humans', body: 'Keep the rhythm programmed for most of the song. Bring in one played instrument only for the ending.' },
    ],
    versions: [
      fact('12-inch extended version, 1985', '5:43 against the single’s 4:58, issued with an instrumental.'),
      fact('2012 remix', 'Made for the closing ceremony of the London Olympics. No. 6 in the UK.'),
      fact('Placebo, 2003', 'On their album Covers. No. 44 in the UK.'),
      fact('Within Temptation, 2003', 'A symphonic metal cover that reached the Dutch top 10.'),
      fact('Meg Myers, 2020', 'No. 1 on Billboard’s Rock Airplay and Alternative Songs charts.'),
      take('What to hear', 'Listen for what each cover does with the drum pattern. It’s the hardest part to replace.'),
    ],
    recorded: 'Demo recorded on eight-track in Sevenoaks, 1983. Finished at East Wickham Farm, Welling, 1984. Single length 4:58.',
  },
};
