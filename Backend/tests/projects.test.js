import request from 'supertest';
import { getTestApp } from './testApp.js';

const email = 'admin@test-agency.com';
const password = 'SuperSecret123!';

describe('Admin Projects CRUD', () => {
  let agent;
  let app;

  beforeAll(async () => {
    ({ app } = await getTestApp());
    const { AdminUser } = await import('../src/models/AdminUser.js');
    const passwordHash = await AdminUser.hashPassword(password);
    await AdminUser.create({ name: 'Test Admin', email, passwordHash, role: 'admin' });

    agent = request.agent(app);
    await agent.post('/api/admin/auth/login').send({ email, password });
  });

  it('rejects creating a project with missing required fields', async () => {
    const res = await agent.post('/api/admin/projects').send({ title: 'Only a title' });
    expect(res.status).toBe(400);
  });

  it('creates, publishes, updates and deletes a project', async () => {
    const createRes = await agent.post('/api/admin/projects').send({
      title: 'Test Case Study',
      category: 'Web App',
      summary: 'A sample project created by the automated test suite.',
      status: 'draft',
    });
    expect(createRes.status).toBe(201);
    const project = createRes.body.data;
    expect(project.slug).toBe('test-case-study');

    // Draft projects must not be visible on the public endpoint.
    const publicListBeforePublish = await request(app).get('/api/public/projects');
    expect(publicListBeforePublish.body.data.find((p) => p._id === project._id)).toBeUndefined();

    const updateRes = await agent.patch(`/api/admin/projects/${project._id}`).send({ status: 'published' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('published');

    const publicDetail = await request(app).get(`/api/public/projects/${project.slug}`);
    expect(publicDetail.status).toBe(200);
    expect(publicDetail.body.data.title).toBe('Test Case Study');

    const deleteRes = await agent.delete(`/api/admin/projects/${project._id}`);
    expect(deleteRes.status).toBe(200);

    const afterDelete = await agent.get(`/api/admin/projects/${project._id}`);
    expect(afterDelete.status).toBe(404);
  });
});
