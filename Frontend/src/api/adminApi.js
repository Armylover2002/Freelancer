import { adminClient, unwrap, unwrapFull } from './axiosClient.js';

function makeCrudApi(resource) {
  return {
    list: (params) => unwrapFull(adminClient.get(`/${resource}`, { params })),
    getById: (id) => unwrap(adminClient.get(`/${resource}/${id}`)),
    create: (payload) => unwrap(adminClient.post(`/${resource}`, payload)),
    update: (id, payload) => unwrap(adminClient.patch(`/${resource}/${id}`, payload)),
    remove: (id) => unwrap(adminClient.delete(`/${resource}/${id}`)),
  };
}

export const projectsAdminApi = makeCrudApi('projects');
export const servicesAdminApi = makeCrudApi('services');
export const pricingAdminApi = makeCrudApi('pricing');
export const teamAdminApi = makeCrudApi('team');
export const testimonialsAdminApi = makeCrudApi('testimonials');
export const faqsAdminApi = makeCrudApi('faqs');

export const dashboardApi = {
  get: () => unwrap(adminClient.get('/dashboard')),
};

export const enquiriesAdminApi = {
  list: (params) => unwrapFull(adminClient.get('/enquiries', { params })),
  getById: (id) => unwrap(adminClient.get(`/enquiries/${id}`)),
  updateStatus: (id, payload) => unwrap(adminClient.patch(`/enquiries/${id}/status`, payload)),
  addNote: (id, payload) => unwrap(adminClient.post(`/enquiries/${id}/notes`, payload)),
  update: (id, payload) => unwrap(adminClient.patch(`/enquiries/${id}`, payload)),
  exportCsvUrl: () => `${adminClient.defaults.baseURL}/enquiries/export.csv`,
};

export const clientsAdminApi = {
  list: (params) => unwrapFull(adminClient.get('/clients', { params })),
  getById: (id) => unwrap(adminClient.get(`/clients/${id}`)),
  addNote: (id, payload) => unwrap(adminClient.post(`/clients/${id}/notes`, payload)),
  updateStatus: (id, payload) => unwrap(adminClient.patch(`/clients/${id}/status`, payload)),
};

export const mediaAdminApi = {
  list: (params) => unwrapFull(adminClient.get('/media', { params })),
  upload: (files, extra = {}, onUploadProgress) => {
    const form = new FormData();
    (Array.isArray(files) ? files : [files]).forEach((f) => form.append('files', f));
    Object.entries(extra).forEach(([k, v]) => form.append(k, v));
    return unwrap(
      adminClient.post('/media', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      })
    );
  },
  update: (id, payload) => unwrap(adminClient.patch(`/media/${id}`, payload)),
  remove: (id) => unwrap(adminClient.delete(`/media/${id}`)),
};

export const settingsAdminApi = {
  get: () => unwrap(adminClient.get('/settings')),
  update: (payload) => unwrap(adminClient.patch('/settings', payload)),
};

export const adminUsersApi = {
  list: () => unwrap(adminClient.get('/users')),
  invite: (payload) => unwrap(adminClient.post('/users', payload)),
  update: (id, payload) => unwrap(adminClient.patch(`/users/${id}`, payload)),
  deactivate: (id) => unwrap(adminClient.delete(`/users/${id}`)),
};

export const auditLogsApi = {
  list: (params) => unwrapFull(adminClient.get('/audit-logs', { params })),
};
