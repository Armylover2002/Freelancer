import request from 'supertest';
import { getTestApp } from './testApp.js';

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const { app } = await getTestApp();
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});
