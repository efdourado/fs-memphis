import * as adminService from '../../../../services/adminService';
import * as collectionService from '../../../../services/collectionService';

export const postFormConfig = {
  initialState: {
    title: '',
    subtitle: '',
    coverImage: '',
    bodyMarkdown: '',
    tags: [],
    relatedTracks: [],
    relatedArtists: [],
    status: 'draft',
  },
  api: {
    fetchById: (slug) => adminService.fetchPosts().then(res => res.data.find(p => p.slug === slug)),
    create: adminService.createPost,
    update: adminService.updatePost,
  },
  relations: {
    tags: { fetch: adminService.fetchTags },
    songs: { fetch: collectionService.fetchSongs },
    artists: { fetch: collectionService.fetchArtists },
  },
  processDataForForm: (data) => ({
    ...data,
    tags: data.tags?.map(t => t._id) || [],
    relatedTracks: data.relatedTracks?.map(s => s._id) || [],
    relatedArtists: data.relatedArtists?.map(a => a._id) || [],
    coverImage: data.coverImage?.url || '',
  }),
  processDataForSubmit: (data) => ({
    ...data,
    coverImage: { url: data.coverImage, alt: `Cover for ${data.title}` }
  }),
  fields: [
    { name: 'title', label: 'Post Title', type: 'text', required: true, span: 'span-2' },
    { name: 'subtitle', label: 'Subtitle', type: 'text', span: 'span-2' },
    { name: 'coverImage', label: 'Cover Image (URL)', type: 'url', span: 'span-2' },
    { name: 'bodyMarkdown', label: 'Content', component: 'textarea', rows: '10', span: 'span-2' },
    { name: 'status', label: 'Status', component: 'select', options: [{ _id: 'draft', title: 'Draft' }, { _id: 'published', title: 'Published' }] },
    { name: 'tags', label: 'Tags', component: 'select', optionsKey: 'tags', multiple: true, className: 'admin-form__multiselect' },
    { name: 'relatedTracks', label: 'Related Songs', component: 'select', optionsKey: 'songs', multiple: true, className: 'admin-form__multiselect' },
    { name: 'relatedArtists', label: 'Related Artists', component: 'select', optionsKey: 'artists', multiple: true, className: 'admin-form__multiselect' },
], };