import request from 'supertest';
import mongoose from 'mongoose';
import logger from '../src/logger';
import app from '../src/app';
import config from '../src/config';
import { UserModel } from '../src/user/user.model';

const DB_URI = `${config.testDb.uri}_users`;
const defaultSecretKey = config.jwtSecret;

let token;

beforeAll(async () => {
  mongoose.set('strictQuery', true);
  const connectionResult = await mongoose.connect(DB_URI);
  const userToRegister = {
    name: 'Joe',
    email: 'joe@joe.com',
    password: '$2b$10$ywaNE50jZV7frXFIA0e72uLJUa6GbH48i5OJmAg2Zggr42JD2ehpe',
    isVerified: true,
  };
  await UserModel.create(userToRegister);
  config.jwtSecret = 'thisisaspecialsecret';

  const response = await request(app)
    .post('/api/login')
    .send({
      email: 'joe@joe.com',
      password: '123456789',
    });
  token = response.body.token;
  logger.info(`Connected to ${connectionResult.connection.name} database`);
});

afterAll(async () => {
  config.jwtSecret = defaultSecretKey;
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

test('PATCH /api/users with valid data -updating both name and password- should respond with 200', (done) => {
  const userToUpdate = {
    name: 'Joe Little',
    password: '123456789',
  };

  request(app)
    .patch('/api/users')
    .send(userToUpdate)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, data) => {
      if (err) return done(err);
      expect(data.body.name).toBe('Joe Little');
      expect(data.body.email).toBe('joe@joe.com');
      expect(data.body.id).toBeTruthy();
      expect(data.body.token).toBeTruthy();
      return done();
    });
});

test('PATCH /api/users with valid data -updating only name- should respond with 200', (done) => {
  const userToUpdate = {
    name: 'Joe Little',
  };

  request(app)
    .patch('/api/users')
    .send(userToUpdate)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, data) => {
      if (err) return done(err);
      expect(data.body.name).toBe('Joe Little');
      expect(data.body.email).toBe('joe@joe.com');
      expect(data.body.id).toBeTruthy();
      expect(data.body.token).toBeTruthy();
      return done();
    });
});

test('PATCH /api/users with valid data -updating only password- should respond with 200', (done) => {
  const userToUpdate = {
    password: '123456789new',
  };

  request(app)
    .patch('/api/users')
    .send(userToUpdate)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, data) => {
      if (err) return done(err);
      expect(data.body.name).toBeTruthy();
      expect(data.body.email).toBe('joe@joe.com');
      expect(data.body.id).toBeTruthy();
      expect(data.body.token).toBeTruthy();
      return done();
    });
});

test('PATCH /api/users with invalid data should respond with 400', (done) => {
  const userToUpdate = {
    email: 'joe@joe.com',
    password: '123',
  };

  request(app)
    .patch('/api/users')
    .send(userToUpdate)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});
