const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create active user for tasks tests
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  
  token = userRes.body.token;
  userId = userRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Task Endpoints', () => {
  describe('POST /api/tasks', () => {
    it('should create a task successfully', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'Pending',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.title).toEqual('Test Task');
      expect(res.body.data.description).toEqual('Test Description');
      expect(res.body.data.status).toEqual('Pending');
      expect(res.body.data.user).toEqual(userId);
    });

    it('should fail with missing title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test Description',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should fail with invalid status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          status: 'InvalidStatus',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Alpha Task', description: 'Description 1', status: 'Pending', user: userId },
        { title: 'Beta Task', description: 'Description 2', status: 'In Progress', user: userId },
        { title: 'Gamma Task', description: 'Description 3', status: 'Completed', user: userId },
      ]);
    });

    it('should fetch all user tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toEqual(3);
    });

    it('should search tasks by title', async () => {
      const res = await request(app)
        .get('/api/tasks?search=beta')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0].title).toEqual('Beta Task');
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/tasks?status=Completed')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0].title).toEqual('Gamma Task');
    });
  });

  describe('GET /api/tasks/stats', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Task 1', status: 'Pending', user: userId },
        { title: 'Task 2', status: 'In Progress', user: userId },
        { title: 'Task 3', status: 'Completed', user: userId },
        { title: 'Task 4', status: 'Pending', user: userId },
      ]);
    });

    it('should fetch task statistics correctly', async () => {
      const res = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.stats.total).toEqual(4);
      expect(res.body.stats.pending).toEqual(2);
      expect(res.body.stats.inProgress).toEqual(1);
      expect(res.body.stats.completed).toEqual(1);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Task to update',
        status: 'Pending',
        user: userId,
      });
      taskId = task._id;
    });

    it('should update task details', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          status: 'In Progress',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.title).toEqual('Updated Title');
      expect(res.body.data.status).toEqual('In Progress');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Task to delete',
        status: 'Pending',
        user: userId,
      });
      taskId = task._id;
    });

    it('should delete the task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Task deleted successfully');

      const checkTask = await Task.findById(taskId);
      expect(checkTask).toBeNull();
    });
  });
});
