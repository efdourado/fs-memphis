import * as adminService from '../../../../services/adminService';
import { fetchUserById, updateUser } from '../../../../services/userService';

export const userFormConfig = {
  initialState: {
    name: '',
    email: '',
    profilePic: '',
    isAdmin: false,
    isArtist: false,

    artistProfile: {
      description: '',
      country: '',
      curatedNotes: '',
      verified: false,
      genres: '',
      socials: { spotify: '', instagram: '', x: '', youtube: '', tiktok: '' },
  } },
  
  api: {
    fetchById: fetchUserById,
    update: updateUser,
    create: adminService.createUser,
  },

  processDataForForm: (data) => ({
    ...data,

    artistProfile: data.artistProfile ? {
        ...data.artistProfile,
        genres: data.artistProfile.genres?.join(', ') || '',
    } : { description: '', country: '', curatedNotes: '', verified: false, genres: '', socials: {} },
  }),
  
  processDataForSubmit: (data) => {
    if (!data.isArtist) {
      const { artistProfile, ...rest } = data;
      return { ...rest, artistProfile: null };
    }

    return {
      ...data,
      artistProfile: {
        ...data.artistProfile,
        genres: data.artistProfile.genres.split(',').map(g => g.trim()).filter(Boolean),
  } }; },
  
  fields: [
    { name: 'profilePic', label: 'Profile Picture URL', type: 'url', span: 'span-2' },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'isAdmin', label: 'Administrator?', description: '(System Privileges)', component: 'checkbox' },
    { name: 'isArtist', label: 'Artist?', description: '(Artist-Specific Tools)', component: 'checkbox' },

    { name: 'artistProfile.genres', label: 'Genres (Comma-Separated)', type: 'text', condition: (data) => data.isArtist },
    { name: 'artistProfile.country', label: 'Country / Scene', type: 'text', condition: (data) => data.isArtist },
    { name: 'artistProfile.verified', label: 'Verified?', description: '(Artist Status)', component: 'checkbox', condition: (data) => data.isArtist },
    { name: 'artistProfile.description', label: 'Description', component: 'textarea', rows: '4', span: 'span-2', condition: (data) => data.isArtist },
    { name: 'artistProfile.curatedNotes', label: 'Curiosities & Notes', component: 'textarea', rows: '4', span: 'span-2', condition: (data) => data.isArtist },
    { name: 'artistProfile.socials.spotify', label: 'Spotify Reference', type: 'url', condition: (data) => data.isArtist },
    { name: 'artistProfile.socials.youtube', label: 'YouTube Reference', type: 'url', condition: (data) => data.isArtist },
    { name: 'artistProfile.socials.instagram', label: 'Instagram', type: 'url', condition: (data) => data.isArtist },
], };

export const artistFormConfig = {
  ...userFormConfig,
  initialState: {
    ...userFormConfig.initialState,
    isArtist: true,
  },
  processDataForSubmit: (data) => userFormConfig.processDataForSubmit({ ...data, isArtist: true }),
  fields: userFormConfig.fields.filter((field) => !['isAdmin', 'isArtist'].includes(field.name)),
};
