import UserModel from '../persistence/models/userModel.js';
import SongModel from '../persistence/models/songModel.js';
import AlbumModel from '../persistence/models/albumModel.js';
import PlaylistModel from '../persistence/models/playlistModel.js';
import AppError from './appError.js';

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const MAX_PLAYLIST_SONG_IDS = 400;

export class SearchService {
  async search(query) {
    const trimmed = typeof query === 'string' ? query.trim() : '';
    if (!trimmed) {
      throw new AppError('Query parameter is required', 400);
    }

    const searchRegex = new RegExp(escapeRegex(trimmed), 'i');

    const [artists, albums, songs, playlists] = await Promise.all([
      UserModel.find({ name: searchRegex, isArtist: true }).limit(10).lean(),
      AlbumModel.find({ title: searchRegex })
        .populate('artist', 'name profilePic isArtist artistProfile')
        .limit(10)
        .lean(),
      SongModel.find({
        $or: [
          { title: searchRegex },
          { subtitle: searchRegex },
          { description: searchRegex },
          { lyrics: searchRegex },
          { genre: searchRegex },
          { genres: searchRegex },
          { emotions: searchRegex },
          { instruments: searchRegex },
          { 'editorial.story': searchRegex },
          { 'education.theoryNotes': searchRegex },
          { 'education.productionBreakdown': searchRegex },
        ],
      })
        .populate('artist', 'name profilePic isArtist artistProfile')
        .populate('album')
        .limit(10)
        .lean(),
      this.searchPlaylists(searchRegex),
    ]);

    return { artists, albums, songs, playlists };
  }

  async searchPlaylists(searchRegex) {
    const [titleSongIds, lyricsSongIds] = await Promise.all([
      SongModel.find({ title: searchRegex }).select('_id').lean(),
      SongModel.find({ lyrics: searchRegex }).select('_id').lean(),
    ]);

    const titleSet = new Set(titleSongIds.map((s) => String(s._id)));
    const lyricsSet = new Set(lyricsSongIds.map((s) => String(s._id)));
    const anySongIds = [...new Set([...titleSet, ...lyricsSet])].slice(0, MAX_PLAYLIST_SONG_IDS);

    const playlistOr = [
      { name: searchRegex },
      { description: searchRegex },
      { tags: searchRegex },
    ];
    if (anySongIds.length > 0) {
      playlistOr.push({ 'songs.song': { $in: anySongIds } });
    }

    const raw = await PlaylistModel.find({ isPublic: true, $or: playlistOr })
      .populate('owner', 'name profilePic')
      .limit(10)
      .lean();

    return raw.map((p) => {
      const tagMatch = (p.tags || []).some((t) => searchRegex.test(t));
      const metaMatch =
        searchRegex.test(p.name || '') ||
        searchRegex.test(p.description || '') ||
        tagMatch;

      const songRefs = (p.songs || [])
        .map((s) => (s.song != null ? String(s.song) : ''))
        .filter(Boolean);

      const hasLyrics = songRefs.some((id) => lyricsSet.has(id));
      const hasTitle = songRefs.some((id) => titleSet.has(id));

      let kind = 'metadata';
      if (hasLyrics) kind = 'lyrics';
      else if (hasTitle) kind = 'song';
      else if (metaMatch) kind = 'metadata';

      return { ...p, searchMatch: { kind } };
    });
  }
}
