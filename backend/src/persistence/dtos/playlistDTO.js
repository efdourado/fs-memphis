export class PlaylistDTO {
  id = null;
  name = '';
  description = '';
  owner = null;
  songs = [];
  coverImage = '';
  isPublic = true;

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      owner: this.owner,
      songs: this.songs,
      coverImage: this.coverImage,
      isPublic: this.isPublic,
}; } }