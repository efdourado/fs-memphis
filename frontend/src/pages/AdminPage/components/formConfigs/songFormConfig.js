import * as adminService from '../../../../services/adminService';
import * as collectionService from '../../../../services/collectionService';

export const songFormConfig = {
  initialState: {
    title: '',
    artist: '',
    album: '',
    durationMs: 0,
    audioUrl: '',
    lyrics: '',
    isExplicit: false,
    releaseDate: '',
    genres: '',
    emotions: '',
    instruments: '',
    tags: [],
    analysis: {
      bpm: '',
      key: '',
      mode: 1,
      energy: '',
      danceability: '',
      valence: '',
    },
    editorial: {
      story: '',
      productionNotes: '',
    },
    credits: {
      writers: '',
      producers: '',
    },
    externalLinks: {
      spotify: '',
      youtube: '',
  }, },

  api: {
    fetchById: collectionService.fetchSongById,
    create: adminService.createSong,
    update: adminService.updateSong,
  },

  relations: {
    artists: { fetch: collectionService.fetchArtists },
    albums: { fetch: collectionService.fetchAlbums },
    tags: { fetch: adminService.fetchTags },
  },

  processDataForForm: (data) => ({
    ...data,
    artist: data.artist?._id || '',
    album: data.album?._id || '',
    releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : '',
    genres: data.genres?.join(', ') || '',
    emotions: data.emotions?.join(', ') || '',
    instruments: data.instruments?.join(', ') || '',
    tags: data.tags?.map(t => t._id) || [],
    analysis: data.analysis || { bpm: '', key: '', mode: 1 },
    editorial: data.editorial || { story: '', productionNotes: '' },
    credits: {
        ...data.credits,
        writers: data.credits?.writers?.join(', ') || '',
        producers: data.credits?.producers?.join(', ') || '',
    },
    externalLinks: data.externalLinks || { spotify: '', youtube: '' },
  }),

  processDataForSubmit: (data) => {
    const toArray = (str) => str.split(',').map(item => item.trim()).filter(Boolean);
    
    return {
      ...data,
      durationMs: Number(data.durationMs),
      genres: toArray(data.genres),
      emotions: toArray(data.emotions),
      instruments: toArray(data.instruments),
      analysis: {
        ...data.analysis,
        bpm: Number(data.analysis.bpm) || null,
        mode: Number(data.analysis.mode),
        energy: Number(data.analysis.energy) || null,
        danceability: Number(data.analysis.danceability) || null,
        valence: Number(data.analysis.valence) || null,
      },
      credits: {
        ...data.credits,
        writers: toArray(data.credits.writers),
        producers: toArray(data.credits.producers),
  } }; },

  fields: [
    { component: 'divider', label: 'Basic Information' },
    { name: 'title', label: 'Song Title', type: 'text', required: true, span: 'span-2' },
    { name: 'artist', label: 'Artist', component: 'select', optionsKey: 'artists', required: true },
    { name: 'album', label: 'Album', component: 'select', optionsKey: 'albums' },
    { name: 'releaseDate', label: 'Release Date', type: 'date' },
    { name: 'durationMs', label: 'Duration (milliseconds)', type: 'number', required: true },
    { name: 'audioUrl', label: 'Audio (URL)', type: 'url' },
    { name: 'isExplicit', label: 'Explicit?', description: '(Content Warning)', component: 'checkbox' },

    { component: 'divider', label: 'Classification' },
    { name: 'genres', label: 'Genres (Comma-Separated)', type: 'text' },
    { name: 'emotions', label: 'Emotions (Comma-Separated)', type: 'text' },
    { name: 'instruments', label: 'Instruments (Comma-Separated)', type: 'text', span: 'span-2' },
    { name: 'tags', label: 'Editorial Tags', component: 'select', optionsKey: 'tags', multiple: true, className: 'admin-form__multiselect', span: 'span-2' },

    { component: 'divider', label: 'Technical Analysis' },
    { name: 'analysis.bpm', label: 'BPM', type: 'number', span: 'span-2' },
    { name: 'analysis.key', label: 'Key (e.g., C#m, F)', type: 'text' },
    { name: 'analysis.energy', label: 'Energy (0.0-1.0)', type: 'number', step: '0.01' },
    { name: 'analysis.danceability', label: 'Danceability (0.0-1.0)', type: 'number', step: '0.01' },
    { name: 'analysis.valence', label: 'Valence (Positivity, 0.0-1.0)', type: 'number', step: '0.01' },
    
    { component: 'divider', label: 'Editorial & Credits' },
    { name: 'editorial.story', label: 'Creative Story', component: 'textarea', rows: '3' },
    { name: 'editorial.productionNotes', label: 'Production Notes', component: 'textarea', rows: '3' },
    { name: 'credits.writers', label: 'Writers (Comma-Separated)', type: 'text' },
    { name: 'credits.producers', label: 'Producers (Comma-Separated)', type: 'text' },
    
    { component: 'divider', label: 'External Links' },
    { name: 'externalLinks.spotify', label: 'Spotify URL', type: 'url' },
    { name: 'externalLinks.youtube', label: 'YouTube URL', type: 'url' },

    { component: 'divider', label: 'Lyrics' },
    { name: 'lyrics', label: 'Lyrics', component: 'textarea', rows: '10', span: 'span-2' },
], };