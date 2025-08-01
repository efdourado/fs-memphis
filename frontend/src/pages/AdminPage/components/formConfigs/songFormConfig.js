import * as adminService from '../../../../services/adminService';
import * as collectionService from '../../../../services/collectionService';

export const songFormConfig = {
  initialState: {
    title: '',
    artist: '',
    album: '',
    duration: 0,
    audioUrl: '',
    lyrics: '',
    isExplicit: false,
  },
  api: {
    fetchById: collectionService.fetchSongById,
    create: adminService.createSong,
    update: adminService.updateSong,
  },
  relations: {
    artists: { fetch: collectionService.fetchArtists },
    albums: { fetch: collectionService.fetchAlbums },
  },
  processDataForForm: (data) => ({
    ...data,
    artist: data.artist?._id || '',
    album: data.album?._id || '',
  }),
  processDataForSubmit: (data) => ({
    ...data,
    duration: Number(data.duration)
  }),
  fields: [
    { name: 'title', label: 'Song Title', type: 'text', required: true },
    { name: 'isExplicit', label: 'Explicit?', description: '(Content Warning)', component: 'checkbox' },
    { name: 'artist', label: 'Artist', component: 'select', optionsKey: 'artists', required: true },
    { name: 'album', label: 'Album', component: 'select', optionsKey: 'albums' },
    { name: 'duration', label: 'Duration (seconds)', type: 'number', required: true },
    { name: 'audioUrl', label: 'Audio (URL)', type: 'url' },
    { name: 'lyrics', label: 'Lyrics', component: 'textarea', rows: '5', span: 'span-2' },
], };