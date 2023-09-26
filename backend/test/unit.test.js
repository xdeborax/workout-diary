import request from 'supertest';
import mongoose from 'mongoose';
import config from '../src/config';
import app from '../src/app';
import { UserModel } from '../src/user/user.model';
import { UnitModel } from '../src/units/unit.model';

const units = [
  {
    __v: 0,
    _id: '63ea43d5125ae266b2bf6c97',
    unitName: 'időtartam',
    unitValue: ['perc', 'óra'],
  },
  {
    __v: 0,
    _id: '63ea5bad5789737601e9ae47',
    unitName: 'távolság',
    unitValue: ['m', 'km'],
  },
];

const unitsResult = [
  {
    id: '63ea43d5125ae266b2bf6c97',
    unitName: 'időtartam',
    unitValue: ['perc', 'óra'],
  },
  {
    id: '63ea5bad5789737601e9ae47',
    unitName: 'távolság',
    unitValue: ['m', 'km'],
  },
];

const DB_URI = `${config.testDb.uri}_units`;

let token;

beforeAll(async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(DB_URI);
  await UnitModel.create(units[0]);
  await UnitModel.create(units[1]);

  const userToRegister = {
    name: 'Test',
    email: 'test@test.com',
    password: '$2b$10$0.9f.g44Bc7u8q9Rd/V5ZuStRDExNy1wDYAvn6.z7l/9Z0eeQNPSG',
  };
  await UserModel.create({ ...userToRegister, isAdmin: false });
  jest.replaceProperty(config, 'jwtSecret', 'superjwtsecret');

  const response = await request(app).post('/api/login').send({
    email: 'test@test.com',
    password: '123456789',
  });
  token = response.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/sports', () => {
  test('should respond with 401 if token is invalid', async () => {
    const invalidToken = 'cdg697c649dva649';
    const response = await request(app)
      .get('/api/sports')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(401);
  });

  test('should respond with 200 and return all the units', async () => {
    const response = await request(app)
      .get('/api/units')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.units[0]).toEqual(
      expect.objectContaining(unitsResult[0]),
    );
    expect(response.body.units[1]).toEqual(
      expect.objectContaining(unitsResult[1]),
    );
  });
});
