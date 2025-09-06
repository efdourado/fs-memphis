import * as adminService from '../../../../services/adminService';

export const tagFormConfig = {
  initialState: {
    name: '',
    description: '',
    category: 'general',
  },
  api: {
    create: adminService.createTag,
  },
  processDataForSubmit: (data) => ({
    ...data,
  }),
  fields: [
    { name: 'name', label: 'Tag Name', type: 'text', required: true, span: 'span-2' },
    { name: 'category', label: 'Category', type: 'text', span: 'span-2' },
    { name: 'description', label: 'Description', component: 'textarea', rows: '4', span: 'span-2' },
], };