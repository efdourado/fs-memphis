import * as adminService from '../../../../services/adminService';
import * as collectionService from '../../../../services/collectionService';

export const postFormConfig = {
  initialState: {
    title: '',
    subtitle: '',
    coverImage: '',
    content: '',
    type: 'behind_scenes',
    tags: [],
    relatedTracks: [],
    relatedArtists: [],
    status: 'draft',
  },
  api: {
    fetchById: adminService.fetchPostBySlug,
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
    relatedTracks: data.linkedItems?.filter(item => item.itemType === 'Song').map(item => item.itemId?._id || item.itemId) || [],
    relatedArtists: data.linkedItems?.filter(item => item.itemType === 'User').map(item => item.itemId?._id || item.itemId) || [],
    coverImage: data.coverImage || '',
  }),
  processDataForSubmit: (data) => {
    const linkedItems = [
      ...(data.relatedTracks || []).map(itemId => ({ itemType: 'Song', itemId })),
      ...(data.relatedArtists || []).map(itemId => ({ itemType: 'User', itemId })),
    ];

    return {
      title: data.title,
      subtitle: data.subtitle,
      coverImage: data.coverImage,
      content: data.content,
      type: data.type,
      status: data.status,
      tags: data.tags,
      linkedItems,
    };
  },
  fields: [
    { name: 'title', label: 'Post Title', type: 'text', required: true, span: 'span-2' },
    { name: 'subtitle', label: 'Subtitle', type: 'text', span: 'span-2' },
    { name: 'type', label: 'Exclusive Type', component: 'select', options: [
      { _id: 'behind_scenes', title: 'Bastidores' },
      { _id: 'interview', title: 'Interview' },
      { _id: 'event', title: 'Event' },
      { _id: 'diary', title: 'Diary' },
      { _id: 'analysis', title: 'Analysis' },
      { _id: 'story', title: 'Story' },
      { _id: 'tutorial', title: 'Tutorial' },
      { _id: 'podcast_notes', title: 'Podcast Notes' },
      { _id: 'news', title: 'News' },
    ] },
    { name: 'status', label: 'Status', component: 'select', options: [{ _id: 'draft', title: 'Draft' }, { _id: 'published', title: 'Published' }] },
    { name: 'coverImage', label: 'Cover Image (URL)', type: 'url', span: 'span-2' },
    { name: 'content', label: 'Content', component: 'textarea', rows: '10', span: 'span-2' },
    { name: 'tags', label: 'Tags', component: 'select', optionsKey: 'tags', multiple: true, className: 'admin-form__multiselect' },
    { name: 'relatedTracks', label: 'Related Songs', component: 'select', optionsKey: 'songs', multiple: true, className: 'admin-form__multiselect' },
    { name: 'relatedArtists', label: 'Related Artists', component: 'select', optionsKey: 'artists', multiple: true, className: 'admin-form__multiselect' },
], };
