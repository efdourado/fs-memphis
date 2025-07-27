export class AlbumDTO {
  id = null;
  title = '';
  artist = null;
  coverImage = '';
  releaseDate = null;
  genre = [];
  type = 'album';

  toJSON() {
    return {
      title: this.title,
      artist: this.artist,
      coverImage: this.coverImage,
      releaseDate: this.releaseDate,
      genre: this.genre,
      type: this.type,
}; } }