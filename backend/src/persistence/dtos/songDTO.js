export class SongDTO {
  id = null;
  title = '';
  artist = null;
  album = null;
  duration = 0;
  audioUrl = '';
  isExplicit = false;
  genre = [];
  lyrics = '';

  toJSON() {
    return {
      title: this.title,
      artist: this.artist,
      album: this.album,
      duration: this.duration,
      audioUrl: this.audioUrl,
      isExplicit: this.isExplicit,
      genre: this.genre,
      lyrics: this.lyrics,
}; } }