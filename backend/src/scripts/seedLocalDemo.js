import mongoose from 'mongoose';

import { connectToDatabase } from '../config/db.js';
import Album from '../persistence/models/albumModel.js';
import Playlist from '../persistence/models/playlistModel.js';
import Song from '../persistence/models/songModel.js';
import User from '../persistence/models/userModel.js';

const DEMO_TAG = 'memphis-demo';
const DEMO_LABEL = 'Memphis Prototype';
const PROTOTYPE_DURATION_MS = 18_000;

const artists = [
  {
    key: 'lumen-vale',
    name: 'Lumen Vale',
    genres: ['ambient pop', 'electronic'],
    description: 'A fictional Memphis profile built to exercise artist, album and credit layouts.',
    notes: 'Listen for small melodic changes carried across layers.',
  },
  {
    key: 'mira-sol',
    name: 'Mira Sol',
    genres: ['dream pop', 'alternative'],
    description: 'A fictional voice for the local design archive and its discovery flows.',
    notes: 'The prototype favors space, repetition and gentle contrast.',
  },
  {
    key: 'north-arcade',
    name: 'North Arcade',
    genres: ['indietronica', 'synth pop'],
    description: 'A fictional duo used to demonstrate catalog connections without third-party media.',
    notes: 'Rhythmic shapes lead; the harmony stays deliberately open.',
  },
  {
    key: 'vesper-bloom',
    name: 'Vesper Bloom',
    genres: ['art pop', 'downtempo'],
    description: 'An editorial prototype identity created entirely inside Memphis.',
    notes: 'A late-night palette made for the knowledge and archive templates.',
  },
  {
    key: 'glass-harbor',
    name: 'Glass Harbor',
    genres: ['minimal', 'electronic'],
    description: 'A fictional project that keeps the visual system populated while data evolves.',
    notes: 'The arrangement is intentionally sparse so each interface detail has room.',
  },
];

const catalog = [
  {
    key: 'afterimage',
    title: 'Afterimage',
    artist: 'lumen-vale',
    releaseDate: '2025-02-14',
    genre: ['ambient pop', 'electronic'],
    concept: 'Light, memory and the shapes that remain after a sound disappears.',
    tracks: [
      ['first-light', 'First Light', ['hopeful', 'calm'], ['synthesizer', 'soft percussion']],
      ['soft-static', 'Soft Static', ['reflective', 'warm'], ['synthesizer', 'electric piano']],
      ['held-in-color', 'Held in Color', ['dreamy', 'bright'], ['pads', 'bass']],
    ],
  },
  {
    key: 'tidal-memory',
    title: 'Tidal Memory',
    artist: 'mira-sol',
    releaseDate: '2025-05-23',
    genre: ['dream pop', 'alternative'],
    concept: 'Small recollections returning in cycles, never quite in the same form.',
    tracks: [
      ['blue-hour', 'Blue Hour', ['serene', 'nostalgic'], ['keys', 'synthesizer']],
      ['between-stations', 'Between Stations', ['curious', 'restless'], ['bass', 'soft percussion']],
      ['shoreline-notes', 'Shoreline Notes', ['open', 'peaceful'], ['pads', 'bell tones']],
    ],
  },
  {
    key: 'static-garden',
    title: 'Static Garden',
    artist: 'north-arcade',
    releaseDate: '2025-08-08',
    genre: ['indietronica', 'synth pop'],
    concept: 'A digital garden where repetition becomes movement.',
    tracks: [
      ['open-circuit', 'Open Circuit', ['energized', 'playful'], ['arpeggiator', 'drum machine']],
      ['glass-rhythm', 'Glass Rhythm', ['focused', 'driven'], ['synthesizer', 'bass']],
      ['new-signals', 'New Signals', ['optimistic', 'bold'], ['sequencer', 'percussion']],
    ],
  },
  {
    key: 'night-letters',
    title: 'Night Letters',
    artist: 'vesper-bloom',
    releaseDate: '2025-10-31',
    genre: ['art pop', 'downtempo'],
    concept: 'Unsent thoughts arranged as quiet, nocturnal fragments.',
    tracks: [
      ['paper-moon', 'Paper Moon', ['intimate', 'mysterious'], ['electric piano', 'pads']],
      ['low-window', 'Low Window', ['pensive', 'soft'], ['synthesizer', 'sub bass']],
      ['still-writing', 'Still Writing', ['tender', 'reflective'], ['keys', 'ambient texture']],
    ],
  },
  {
    key: 'open-signal',
    title: 'Open Signal',
    artist: 'glass-harbor',
    releaseDate: '2026-01-16',
    genre: ['minimal', 'electronic'],
    concept: 'Simple tones, clear space and the invitation to listen more closely.',
    tracks: [
      ['quiet-frequency', 'Quiet Frequency', ['calm', 'focused'], ['sine tones', 'soft pulse']],
      ['room-tone', 'Room Tone', ['grounded', 'still'], ['ambient texture', 'bass']],
      ['leave-space', 'Leave Space', ['clear', 'restful'], ['synthesizer', 'bell tones']],
    ],
  },
];

const playlistDefinitions = [
  ['Deep Focus', 'A clear path for uninterrupted work.', [0, 4, 7, 12, 14]],
  ['After Midnight', 'Low light, open space and patient motion.', [9, 10, 3, 13, 1]],
  ['Slow Burn', 'Ideas that reveal themselves one layer at a time.', [1, 5, 11, 12, 2]],
  ['Open Windows', 'Airy arrangements for a softer reset.', [0, 5, 2, 14, 8]],
  ['Analog Bloom', 'Warm color inside a digital frame.', [6, 1, 9, 4, 11]],
  ['New Signals', 'Forward motion from the Memphis prototype catalog.', [8, 6, 7, 13, 0]],
  ['Soft Motion', 'Gentle rhythm without losing momentum.', [2, 3, 10, 14, 5]],
  ['Night Drive', 'A darker route through the archive.', [7, 9, 4, 11, 6]],
  ['Memphis Selection', 'The featured prototype collection for the original Home.', [0, 3, 6, 9, 12]],
  ['Design Archive Radio', 'A tour through the components that shaped Memphis.', [2, 5, 8, 11, 14, 1]],
];

const isSeedEnabled = () => ['1', 'true', 'yes'].includes(
  String(process.env.SEED_LOCAL_DEMO || '').toLowerCase(),
);

const isLocalMongoUri = (uri = '') => {
  const match = String(uri).match(/^mongodb:\/\/(?:[^@/]+@)?([^/:,]+)/i);
  if (!match) return false;
  return ['localhost', '127.0.0.1', 'mongo', 'memphis-mongo', '::1'].includes(match[1].toLowerCase());
};

const findOrCreate = async (Model, filter, data) => {
  const existing = await Model.findOne(filter);
  if (existing) return { document: existing, created: false };
  const document = await Model.create(data);
  return { document, created: true };
};

const repairLocalSongTextIndex = async () => {
  const indexes = await Song.collection.indexes();
  const legacyTextIndex = indexes.find((index) => (
    Object.values(index.key).includes('text')
    && index.language_override === 'language'
  ));

  if (legacyTextIndex) {
    await Song.collection.dropIndex(legacyTextIndex.name);
  }
  await Song.createIndexes();
};

export const seedLocalDemo = async () => {
  if (!isSeedEnabled()) {
    console.log('Memphis demo seed skipped (SEED_LOCAL_DEMO is not enabled).');
    return;
  }

  if (!isLocalMongoUri(process.env.MONGODB_URI)) {
    console.log('Memphis demo seed skipped (only local MongoDB instances are allowed).');
    return;
  }

  const created = { users: 0, albums: 0, songs: 0, playlists: 0 };
  await connectToDatabase();

  try {
    await repairLocalSongTextIndex();

    const { document: curator, created: curatorCreated } = await findOrCreate(
      User,
      { email: 'demo+editorial@memphis.local' },
      {
        name: 'Memphis Editorial',
        email: 'demo+editorial@memphis.local',
        password: 'spotify:demo:editorial',
        profilePic: '/api/demo/cover/memphis-editorial.svg',
      },
    );
    if (curatorCreated) created.users += 1;

    const artistDocuments = new Map();
    for (const artist of artists) {
      const { document, created: wasCreated } = await findOrCreate(
        User,
        { email: `demo+${artist.key}@memphis.local` },
        {
          name: artist.name,
          email: `demo+${artist.key}@memphis.local`,
          password: `spotify:demo:${artist.key}`,
          profilePic: `/api/demo/cover/${artist.key}.svg`,
          isArtist: true,
          artistProfile: {
            description: artist.description,
            verified: true,
            genres: artist.genres,
            country: 'Memphis prototype catalog',
            curatedNotes: artist.notes,
          },
        },
      );
      artistDocuments.set(artist.key, document);
      if (wasCreated) created.users += 1;
    }

    const albumDocuments = new Map();
    for (const album of catalog) {
      const artist = artistDocuments.get(album.artist);
      const { document, created: wasCreated } = await findOrCreate(
        Album,
        { title: album.title, artist: artist._id, label: DEMO_LABEL },
        {
          title: album.title,
          artist: artist._id,
          coverImage: `/api/demo/cover/${album.key}.svg`,
          releaseDate: new Date(album.releaseDate),
          genre: album.genre,
          type: 'album',
          copyright: 'Original Memphis prototype media.',
          concept: album.concept,
          label: DEMO_LABEL,
        },
      );
      albumDocuments.set(album.key, document);
      if (wasCreated) created.albums += 1;
    }

    const songDocuments = [];
    let songIndex = 0;
    for (const album of catalog) {
      const artist = artistDocuments.get(album.artist);
      const albumDocument = albumDocuments.get(album.key);
      for (const [key, title, emotions, instruments] of album.tracks) {
        const energy = 0.34 + (songIndex % 5) * 0.1;
        const { document, created: wasCreated } = await findOrCreate(
          Song,
          { 'sharing.slug': `memphis-demo-${key}` },
          {
            title,
            subtitle: 'Original procedural prototype',
            description: `${title} is fictional catalog content created to keep the Memphis listening interface testable.`,
            artist: artist._id,
            album: albumDocument._id,
            durationMs: PROTOTYPE_DURATION_MS,
            audioUrl: `/api/demo/audio/${key}.wav`,
            coverImage: `/api/demo/cover/${album.key}.svg`,
            releaseDate: new Date(album.releaseDate),
            copyright: 'Original procedural audio generated by Memphis.',
            plays: 18_400 - songIndex * 613,
            likesCount: 820 - songIndex * 23,
            genres: album.genre,
            emotions,
            instruments,
            analysis: {
              bpm: 72 + songIndex * 3,
              key: ['C', 'D', 'E', 'F', 'G', 'A'][songIndex % 6],
              mode: songIndex % 2,
              energy,
              danceability: 0.42 + (songIndex % 4) * 0.08,
              acousticness: 0.12,
              valence: 0.38 + (songIndex % 5) * 0.09,
              instrumentalness: 1,
              complexity: 0.35 + (songIndex % 3) * 0.12,
              groove: 0.45 + (songIndex % 4) * 0.09,
              timeSignature: '4/4',
            },
            activityProfiles: {
              focus: 0.82,
              study: 0.78,
              workout: Math.min(1, energy),
              party: 0.35,
              relaxation: 0.72,
              creativity: 0.88,
            },
            audioQuality: {
              codec: 'PCM WAV',
              bitrateKbps: 353,
              sampleRateHz: 22050,
              lossless: true,
            },
            editorial: {
              story: 'A small, Memphis-owned sound sketch designed to make the archive interactive.',
              productionNotes: 'The backend synthesizes this preview on demand; no external recording is copied.',
              listeningGuide: [{
                title: 'Follow the pattern',
                body: 'Notice how the interval changes while the sound palette stays consistent.',
                startMs: 0,
                endMs: PROTOTYPE_DURATION_MS,
              }],
            },
            education: {
              theoryNotes: 'A short repeating interval study.',
              arrangementNotes: 'One motif, layered harmonics and a restrained envelope.',
              productionBreakdown: 'Procedural PCM synthesis generated by Memphis.',
              difficulty: 'beginner',
              techniques: ['interval sequence', 'amplitude envelope'],
              tools: ['Memphis prototype synthesizer'],
              inspiration: ['active listening', 'interface prototyping'],
            },
            credits: {
              writers: ['Memphis Prototype Studio'],
              producers: ['Memphis Prototype Studio'],
              mastering: ['Procedural render'],
              mixing: ['Procedural render'],
              engineers: ['Memphis development environment'],
              musicians: ['Memphis synthesizer'],
              studio: 'Memphis local development',
              label: DEMO_LABEL,
            },
            sharing: {
              slug: `memphis-demo-${key}`,
              allowSharing: false,
            },
          },
        );
        songDocuments.push(document);
        if (wasCreated) created.songs += 1;
        songIndex += 1;
      }
    }

    for (let index = 0; index < playlistDefinitions.length; index += 1) {
      const [name, description, songIndexes] = playlistDefinitions[index];
      const isFeatured = name === 'Memphis Selection';
      const { created: wasCreated } = await findOrCreate(
        Playlist,
        { name, owner: curator._id, tags: DEMO_TAG },
        {
          name,
          description,
          owner: curator._id,
          songs: songIndexes.map((position) => ({
            song: songDocuments[position]._id,
            addedAt: new Date('2026-01-20T12:00:00.000Z'),
          })),
          coverImage: `/api/demo/cover/playlist-${index + 1}.svg`,
          isPublic: true,
          tags: isFeatured ? [DEMO_TAG, 'featured'] : [DEMO_TAG],
        },
      );
      if (wasCreated) created.playlists += 1;
    }

    console.log(
      `Memphis demo catalog ready (${created.users} users, ${created.albums} albums, ${created.songs} songs, ${created.playlists} playlists created).`,
    );
  } finally {
    await mongoose.disconnect();
  }
};

seedLocalDemo().catch((error) => {
  console.error('Failed to seed the local Memphis demo catalog:', error);
  process.exitCode = 1;
});
