import { adminClient, unwrap } from './axiosClient.js';

export const authApi = {
  login: (payload) => unwrap(adminClient.post('/auth/login', payload)),
  logout: () => unwrap(adminClient.post('/auth/logout')),
  me: () => unwrap(adminClient.get('/auth/me')),
};
