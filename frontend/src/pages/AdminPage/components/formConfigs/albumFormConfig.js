import * as adminService from '../../../../services/adminService';
import * as collectionService from '../../../../services/collectionService';

export const albumFormConfig = {
  initialState: {
    title: '',
    artist: '',
    releaseDate: '',
    coverImage: '',
    genre: '',
    type: 'album',
  },

  api: {
    fetchById: collectionService.fetchAlbumById,
    create: adminService.createAlbum,
    update: adminService.updateAlbum,
  },
  
  relations: {
    artists: { fetch: collectionService.fetchArtists },
  },

  processDataForForm: (data) => ({
    ...data,
    releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : '',
    genre: data.genre?.join(', ') || '',
    artist: data.artist?._id || '',
  }),

  processDataForSubmit: (data) => ({
    ...data,
    genre: data.genre.split(',').map(g => g.trim()).filter(Boolean),
  }),

  fields: [
    { name: 'coverImage', label: 'Cover (URL)', type: 'url', span: 'span-2' },
    { name: 'title', label: 'Album Title', type: 'text', required: true },
    {
      name: 'type',
      label: 'Type',
      component: 'select',
      options: [
        { _id: 'album', title: 'Album' },
        { _id: 'single', title: 'Single' },
        { _id: 'ep', title: 'EP' },
        { _id: 'compilation', title: 'Compilation' },
    ], },
    
    { name: 'artist', label: 'Artist', component: 'select', optionsKey: 'artists', required: true },
    { name: 'releaseDate', label: 'Release Date', type: 'date', required: true },
    { name: 'genre', label: 'Genres (Comma-Separated)', type: 'text', span: 'span-2' },
], };