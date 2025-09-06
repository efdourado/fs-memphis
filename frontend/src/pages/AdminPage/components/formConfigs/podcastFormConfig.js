import * as adminService from '../../../../services/adminService';

export const podcastFormConfig = {
  initialState: {
    title: '',
    episodeTitle: '',
    audioUrl: '',
    showNotes: '',
  },
  api: {
    create: adminService.createPodcast,
  },
  fields: [
    { name: 'title', label: 'Podcast Name', type: 'text', required: true, span: 'span-2' },
    { name: 'episodeTitle', label: 'Episode Title', type: 'text', span: 'span-2' },
    { name: 'audioUrl', label: 'Audio URL', type: 'url', required: true, span: 'span-2' },
    { name: 'showNotes', label: 'Show Notes', component: 'textarea', rows: '6', span: 'span-2' },
], };