import { publicClient, unwrap, unwrapFull } from './axiosClient.js';

export const publicApi = {
  getProjects: (params) => unwrapFull(publicClient.get('/projects', { params })),
  getProjectBySlug: (slug) => unwrap(publicClient.get(`/projects/${slug}`)),
  getServices: () => unwrap(publicClient.get('/services')),
  getPricing: () => unwrap(publicClient.get('/pricing')),
  getTeam: () => unwrap(publicClient.get('/team')),
  getTestimonials: () => unwrap(publicClient.get('/testimonials')),
  getFaqs: () => unwrap(publicClient.get('/faqs')),
  getSettings: () => unwrap(publicClient.get('/settings')),
  createEnquiry: (payload) => unwrap(publicClient.post('/enquiries', payload)),
  uploadEnquiryFile: (file, onUploadProgress) => {
    const form = new FormData();
    form.append('file', file);
    return unwrap(
      publicClient.post('/enquiries/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      })
    );
  },
  trackEvent: (payload) => publicClient.post('/analytics/events', payload).catch(() => null),
};
