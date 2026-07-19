import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { connectToDatabase } from '../config/db.js';
import User from '../persistence/models/userModel.js';
import Song from '../persistence/models/songModel.js';
import Album from '../persistence/models/albumModel.js';
import Playlist from '../persistence/models/playlistModel.js';
import PlayEvent from '../persistence/models/playEventModel.js';

const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const outputDirectory = path.resolve('archives');
const outputPath = path.join(outputDirectory, `memphis-design-archive-${timestamp}.json`);

try {
  await connectToDatabase();
  const [users, songs, albums, playlists, playEvents] = await Promise.all([
    User.find().select('-password -spotifyAccessToken -spotifyRefreshToken').lean(),
    Song.find().lean(),
    Album.find().lean(),
    Playlist.find().lean(),
    PlayEvent.find().lean(),
  ]);

  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    version: 1,
    collections: { users, songs, albums, playlists, playEvents },
  }, null, 2));

  console.log(`Legacy archive written to ${outputPath}`);
} finally {
  await mongoose.disconnect();
}
