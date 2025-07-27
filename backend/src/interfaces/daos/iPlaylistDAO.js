export class IPlaylistDAO {
  async findAll() {}
  async findById(id) {}
  async findByOwner(ownerId) {}
  async create(playlistData) {}
  async updateById(id, updateData) {}
  async deleteById(id) {}
  async addSong(playlistId, songId) {}
  async removeSong(playlistId, songId) {}
}