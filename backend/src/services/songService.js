import AppError from './appError.js';

const ACTIVITY_KEYS = ['focus', 'study', 'workout', 'party', 'relaxation', 'creativity'];
const AUDIO_TRAITS = ['energy', 'danceability', 'valence', 'acousticness', 'instrumentalness', 'speechiness', 'liveness'];
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const toId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value._id) return value._id.toString();
  return value.toString();
};

const normalizeToken = (value) => String(value || '').trim().toLowerCase();
const getSongGenres = (song) => (song.genres?.length ? song.genres : song.genre || []);

const addWeightedCount = (map, key, weight) => {
  const normalized = normalizeToken(key);
  if (!normalized) return;
  map.set(normalized, (map.get(normalized) || 0) + weight);
};

const scoreArrayAgainstMap = (values = [], map, totalWeight) => {
  if (!totalWeight || !Array.isArray(values) || values.length === 0) return 0;
  const score = values.reduce((sum, value) => sum + (map.get(normalizeToken(value)) || 0), 0);
  return clamp(score / totalWeight);
};

const numericFactor = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? clamp(number) : 0;
};

export class SongService {
  constructor(songDAO, userDAO, playEventDAO) {
    this.songDAO = songDAO;
    this.userDAO = userDAO;
    this.playEventDAO = playEventDAO;
  }

  async getAllSongs() {
    return this.songDAO.findAll();
  }

  async getSongById(id) {
    const song = await this.songDAO.findById(id);
    if (!song) {
      throw new AppError('Song not found', 404);
    }
    return song;
  }
  
  async createSong(songData) {
    if (!songData.title || !songData.artist || !songData.durationMs) {
      throw new AppError('Title, artist, and duration (ms) are required.', 400);
    }
    return await this.songDAO.create(songData);
  }

  async updateSong(id, updateData) {
    const updatedSong = await this.songDAO.updateById(id, updateData);
    if (!updatedSong) {
      throw new AppError('Song not found', 404);
    }
    return updatedSong;
  }
  
  async deleteSong(id) {
    const deletedSong = await this.songDAO.deleteById(id);
    if (!deletedSong) {
      throw new AppError('Song not found', 404);
    }
    return deletedSong;
  }
  
  async recordPlay(id, { userId, context = {}, activity = '', source = 'web' } = {}) {
    const song = await this.songDAO.incrementPlayCount(id);
    if (!song) {
      throw new AppError('Song not found', 404);
    }

    if (userId) {
      await Promise.all([
        this.userDAO.recordRecentlyPlayed(userId, id),
        this.playEventDAO.create({
          user: userId,
          song: id,
          artist: song.artist,
          album: song.album,
          context: this._sanitizePlayContext(context),
          activity,
          source,
        }),
      ]);
    }

    return song;
  }

  async incrementPlayCount(id) {
    return this.recordPlay(id);
  }

  async trackShare(id) {
    const song = await this.songDAO.incrementShareCount(id);
    if (!song) {
      throw new AppError('Song not found', 404);
    }
    return {
      shares: song.shares || 0,
      shareUrl: song.sharing?.canonicalUrl || `/song/${song._id}`,
    };
  }

  async getRecommendations({ userId, activity = '', limit = 20, mode = 'balanced' } = {}) {
    const scoredSongs = await this._getScoredSongs({ userId, activity, mode });
    return scoredSongs.slice(0, limit);
  }

  async getExplainableShuffle({ userId, activity = '', limit = 50, mode = 'balanced' } = {}) {
    const normalizedMode = ['classic', 'balanced', 'discovery', 'favorites'].includes(mode) ? mode : 'balanced';
    const scoredSongs = await this._getScoredSongs({ userId, activity, mode: normalizedMode });
    const queue = normalizedMode === 'classic'
      ? this._classicShuffle(scoredSongs).slice(0, limit)
      : this._weightedShuffle(scoredSongs, limit);

    return {
      mode: normalizedMode,
      activity: ACTIVITY_KEYS.includes(activity) ? activity : '',
      formula: this._formulaForMode(normalizedMode),
      queue,
    };
  }

  async _getScoredSongs({ userId, activity = '', mode = 'balanced' }) {
    const [songs, user] = await Promise.all([
      this.songDAO.findAll(),
      userId ? this.userDAO.findByIdWithTasteData(userId) : null,
    ]);

    const profile = this._buildTasteProfile(user);
    const normalizedActivity = ACTIVITY_KEYS.includes(activity) ? activity : '';

    return songs
      .map(song => this._scoreSong(song, profile, { activity: normalizedActivity, mode }))
      .sort((a, b) => b.recommendation.score - a.recommendation.score);
  }

  _buildTasteProfile(user) {
    const profile = {
      hasSignals: false,
      likedSongIds: new Set(),
      recentSongIds: new Set(),
      followedArtistIds: new Set((user?.following || []).map(toId).filter(Boolean)),
      genres: new Map(),
      emotions: new Map(),
      instruments: new Map(),
      artists: new Map(),
      totals: { genres: 0, emotions: 0, instruments: 0, artists: 0 },
      audioSums: {},
      audioWeight: 0,
    };

    const ingestSong = (song, weight, kind) => {
      if (!song) return;
      profile.hasSignals = true;
      const songId = toId(song);
      if (kind === 'liked') profile.likedSongIds.add(songId);
      if (kind === 'recent') profile.recentSongIds.add(songId);

      getSongGenres(song).forEach(genre => addWeightedCount(profile.genres, genre, weight));
      (song.emotions || []).forEach(emotion => addWeightedCount(profile.emotions, emotion, weight));
      (song.instruments || []).forEach(instrument => addWeightedCount(profile.instruments, instrument, weight));

      profile.totals.genres += getSongGenres(song).length * weight;
      profile.totals.emotions += (song.emotions || []).length * weight;
      profile.totals.instruments += (song.instruments || []).length * weight;

      const artistId = toId(song.artist);
      if (artistId) {
        addWeightedCount(profile.artists, artistId, weight);
        profile.totals.artists += weight;
      }

      AUDIO_TRAITS.forEach(trait => {
        const value = Number(song.analysis?.[trait]);
        if (Number.isFinite(value)) {
          profile.audioSums[trait] = (profile.audioSums[trait] || 0) + value * weight;
        }
      });
      profile.audioWeight += weight;
    };

    (user?.likedSongs || []).forEach(song => ingestSong(song, 2, 'liked'));
    (user?.recentlyPlayed || []).forEach(item => ingestSong(item.song, 1, 'recent'));

    return profile;
  }

  _scoreSong(song, profile, { activity, mode }) {
    const songId = toId(song);
    const artistId = toId(song.artist);
    const factors = {
      taste: this._tasteScore(song, profile),
      activity: activity ? numericFactor(song.activityProfiles?.[activity]) : 0,
      popularity: clamp(Math.log10((song.plays || 0) + 1) / 5),
      freshness: this._freshnessScore(song.releaseDate),
      metadata: this._metadataScore(song),
      novelty: profile.hasSignals && (profile.likedSongIds.has(songId) || profile.recentSongIds.has(songId)) ? 0.15 : 1,
      followedArtist: profile.followedArtistIds.has(artistId) ? 1 : 0,
    };

    const weights = this._weightsForMode(mode);
    const score = Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (factors[key] || 0) * weight;
    }, 0);

    return {
      ...song,
      recommendation: {
        score: Number(clamp(score).toFixed(4)),
        mode,
        activity,
        formula: this._formulaForMode(mode),
        factors: Object.fromEntries(
          Object.entries(factors).map(([key, value]) => [key, Number(value.toFixed(4))])
        ),
      },
    };
  }

  _tasteScore(song, profile) {
    if (!profile.hasSignals) return 0.35;

    const genreScore = scoreArrayAgainstMap(getSongGenres(song), profile.genres, profile.totals.genres);
    const emotionScore = scoreArrayAgainstMap(song.emotions, profile.emotions, profile.totals.emotions);
    const instrumentScore = scoreArrayAgainstMap(song.instruments, profile.instruments, profile.totals.instruments);
    const artistScore = scoreArrayAgainstMap([toId(song.artist)], profile.artists, profile.totals.artists);

    const audioScores = AUDIO_TRAITS.map(trait => {
      const songValue = Number(song.analysis?.[trait]);
      const profileAverage = profile.audioWeight ? profile.audioSums[trait] / profile.audioWeight : null;
      return Number.isFinite(songValue) && Number.isFinite(profileAverage)
        ? 1 - Math.abs(songValue - profileAverage)
        : null;
    }).filter(value => value !== null);
    const audioScore = audioScores.length
      ? clamp(audioScores.reduce((sum, value) => sum + value, 0) / audioScores.length)
      : 0;

    return clamp(
      genreScore * 0.24 +
      emotionScore * 0.2 +
      instrumentScore * 0.14 +
      artistScore * 0.22 +
      audioScore * 0.2
    );
  }

  _freshnessScore(releaseDate) {
    if (!releaseDate) return 0.3;
    const ageMs = Date.now() - new Date(releaseDate).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays <= 90) return 1;
    if (ageDays <= 365) return 0.75;
    if (ageDays <= 1095) return 0.5;
    return 0.25;
  }

  _metadataScore(song) {
    const checks = [
      getSongGenres(song).length,
      song.emotions?.length,
      song.instruments?.length,
      song.structure?.length,
      song.analysis?.bpm || song.analysis?.key,
      song.editorial?.story || song.editorial?.productionNotes,
      song.education?.theoryNotes || song.education?.productionBreakdown,
      song.credits?.writers?.length || song.credits?.producers?.length,
      song.externalLinks && Object.values(song.externalLinks).some(Boolean),
      song.audioQuality?.codec || song.audioQuality?.bitrateKbps,
    ];

    return checks.filter(Boolean).length / checks.length;
  }

  _weightsForMode(mode) {
    if (mode === 'discovery') {
      return { novelty: 0.32, activity: 0.22, metadata: 0.16, freshness: 0.12, taste: 0.1, popularity: 0.08 };
    }
    if (mode === 'favorites') {
      return { taste: 0.38, followedArtist: 0.18, popularity: 0.18, activity: 0.14, metadata: 0.08, freshness: 0.04 };
    }
    if (mode === 'classic') {
      return { popularity: 1 };
    }
    return { taste: 0.32, activity: 0.18, popularity: 0.18, freshness: 0.1, metadata: 0.1, novelty: 0.08, followedArtist: 0.04 };
  }

  _formulaForMode(mode) {
    const weights = this._weightsForMode(mode);
    return Object.entries(weights)
      .map(([factor, weight]) => `${factor} x ${weight}`)
      .join(' + ');
  }

  _weightedShuffle(scoredSongs, limit) {
    const pool = scoredSongs.map(song => ({
      song,
      weight: Math.max(song.recommendation.score, 0.001),
    }));
    const queue = [];

    while (pool.length > 0 && queue.length < limit) {
      const total = pool.reduce((sum, item) => sum + item.weight, 0);
      let cursor = Math.random() * total;
      const index = pool.findIndex(item => {
        cursor -= item.weight;
        return cursor <= 0;
      });
      const selectedIndex = index >= 0 ? index : pool.length - 1;
      queue.push(pool[selectedIndex].song);
      pool.splice(selectedIndex, 1);
    }

    return queue;
  }

  _classicShuffle(songs) {
    const shuffled = [...songs];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled.map(song => ({
      ...song,
      recommendation: {
        ...song.recommendation,
        score: 1 / Math.max(songs.length, 1),
        formula: 'Fisher-Yates uniform shuffle: each remaining song has equal probability',
      },
    }));
  }

  _sanitizePlayContext(context) {
    const type = ['album', 'playlist', 'artist', 'search', 'recommendation', 'shuffle', 'library'].includes(context?.type)
      ? context.type
      : '';
    const id = OBJECT_ID_PATTERN.test(context?.id || '') ? context.id : undefined;

    return {
      type,
      id,
      label: context?.label || '',
    };
  }
}
