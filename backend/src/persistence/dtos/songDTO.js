export class SongDTO {
  id = null;
  title = '';
  artist = null;
  album = null;
  duration = 0;
  audioUrl = '';
  releaseDate = null;
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
      releaseDate: this.releaseDate,
      isExplicit: this.isExplicit,
      genre: this.genre,
      lyrics: this.lyrics,
}; } }