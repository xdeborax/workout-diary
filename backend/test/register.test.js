import request from 'supertest';
import mongoose from 'mongoose';
import logger from '../src/logger';
import app from '../src/app';
import config from '../src/config';

const DB_URI = `${config.testDb.uri}_register`;

beforeAll(async () => {
  mongoose.set('strictQuery', true);
  const connectionResult = await mongoose.connect(DB_URI);
  logger.info(`Connected to ${connectionResult.connection.name} database`);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('POST /api/register with valid data should respond with 200', (done) => {
  const userToRegister = {
    name: 'John Doe',
    email: 'johndoe6@test.com',
    password: 'password123',
  };

  request(app)
    .post('/api/register')
    .send(userToRegister)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, data) => {
      if (err) return done(err);
      expect(data.body.name).toBe('John Doe');
      expect(data.body.email).toBe('johndoe6@test.com');
      expect(data.body.id).toBeTruthy();
      return done();
    });
});

test('POST /api/register with invalid data should respond with 400', (done) => {
  const userToRegister = {
    name: 'John Doe',
    password: 'password123',
  };

  request(app)
    .post('/api/register')
    .send(userToRegister)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});
