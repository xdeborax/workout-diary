import request from 'supertest';
import mongoose from 'mongoose';
import logger from '../src/logger';
import app from '../src/app';
import config from '../src/config';
import { UserModel } from '../src/user/user.model';

const DB_URI = `${config.testDb.uri}_login`;

beforeAll(async () => {
  mongoose.set('strictQuery', true);
  const connectionResult = await mongoose.connect(DB_URI);
  await mongoose.connection.db.dropDatabase();
  const userToRegister = {
    name: 'Tester',
    email: 'tester@tester.com',
    password: '$2b$10$UJdRsD0kJ0NXojQ5I6OGIOC1z0sHKZDJGTXeJqR3Qe8Yyp55rSLji',
  };
  await UserModel.create(userToRegister);
  jest.replaceProperty(config, 'jwtSecret', 'superjwtsecret');
  logger.info(`Connected to ${connectionResult.connection.name} database`);
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('POST /api/login with valid email address and password combination should respond with 200', (done) => {
  const userToLogin = {
    email: 'tester@tester.com',
    password: '12345678',
  };

  request(app)
    .post('/api/login')
    .send(userToLogin)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, data) => {
      if (err) return done(err);
      expect(data.body.token).toBeTruthy();
      return done();
    });
});

test('POST /api/login with invalid email address and password combination should respond with 400', (done) => {
  const userToLogin = {
    email: 'tester@tester.com',
    password: '1234567',
  };

  request(app)
    .post('/api/login')
    .send(userToLogin)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('POST /api/login with invalid data should respond with 400', (done) => {
  const userToLogin = {
    password: 'password123',
  };

  request(app)
    .post('/api/login')
    .send(userToLogin)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('POST /api/login with invalid data should respond with 400', (done) => {
  const userToLogin = {
    email: 'johndoe5@gmail.com',
  };

  request(app)
    .post('/api/login')
    .send(userToLogin)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});
