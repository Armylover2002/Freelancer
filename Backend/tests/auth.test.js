import request from 'supertest';
import { getTestApp } from './testApp.js';

const email = 'owner@test-agency.com';
const password = 'SuperSecret123!';

describe('Admin authentication', () => {
  beforeAll(async () => {
    await getTestApp();
    const { AdminUser } = await import('../src/models/AdminUser.js');
    const passwordHash = await AdminUser.hashPassword(password);
    await AdminUser.create({ name: 'Test Owner', email, passwordHash, role: 'owner' });
  });

  it('rejects invalid credentials', async () => {
    const { app } = await getTestApp();
    const res = await request(app).post('/api/admin/auth/login').send({ email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('rejects access to protected routes without a session', async () => {
    const { app } = await getTestApp();
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
  });

  it('logs in with valid credentials and can access a protected route using the session cookie', async () => {
    const { app } = await getTestApp();
    const agent = request.agent(app);

    const loginRes = await agent.post('/api/admin/auth/login').send({ email, password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.admin.email).toBe(email);

    const meRes = await agent.get('/api/admin/auth/me');
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.admin.role).toBe('owner');

    const dashboardRes = await agent.get('/api/admin/dashboard');
    expect(dashboardRes.status).toBe(200);
    expect(dashboardRes.body.data.kpis).toBeDefined();
  });

  it('logs out and revokes access', async () => {
    const { app } = await getTestApp();
    const agent = request.agent(app);
    await agent.post('/api/admin/auth/login').send({ email, password });
    await agent.post('/api/admin/auth/logout');

    const res = await agent.get('/api/admin/auth/me');
    expect(res.status).toBe(401);
  });
});
