import request from 'supertest';
import mongoose from 'mongoose';
import config from '../src/config';
import app from '../src/app';
import { UserModel } from '../src/user/user.model';
import { SportTypeModel } from '../src/sportType/sportType.model';

const sportTypes = [
  {
    _id: '642d8b3a16e798e148aaa9a0',
    type: 'Futás',
    hasPropDistance: true,
    hasPropExercises: false,
    __v: 0,
  },
  {
    _id: '642d8bca16e798e148aaa9a3',
    type: 'Crossfit',
    hasPropDistance: false,
    hasPropExercises: true,
    __v: 0,
  },
];

const sportTypesResult = [
  {
    id: '642d8b3a16e798e148aaa9a0',
    type: 'Futás',
    hasPropDistance: true,
    hasPropExercises: false,
  },
  {
    id: '642d8bca16e798e148aaa9a3',
    type: 'Crossfit',
    hasPropDistance: false,
    hasPropExercises: true,
  },
];

const DB_URI = `${config.testDb.uri}_sportTypes`;

let token;
let idOfFirstSportType;

beforeAll(async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(DB_URI);
  const firstSportType = await SportTypeModel.create(sportTypes[0]);
  await SportTypeModel.create(sportTypes[1]);
  idOfFirstSportType = firstSportType._id;

  const adminToRegister = {
    name: 'Test',
    email: 'test@test.com',
    password: '$2b$10$0.9f.g44Bc7u8q9Rd/V5ZuStRDExNy1wDYAvn6.z7l/9Z0eeQNPSG',
  };
  await UserModel.create({ ...adminToRegister, isAdmin: true, isVerified: true });
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

  test('should respond with 200 and return all the sport types', async () => {
    const response = await request(app)
      .get('/api/sports')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.sportTypes[0]).toEqual(
      expect.objectContaining(sportTypesResult[1]),
    );
    expect(response.body.sportTypes[1]).toEqual(
      expect.objectContaining(sportTypesResult[0]),
    );
  });
});

describe('POST /api/admin/sports', () => {
  test('should respond with 401 if not an admin wants to add a sport type', async () => {
    const invalidToken = 'cdg697c649dva649';
    const response = await request(app)
      .post('/api/admin/sports')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(401);
  });

  test('should respond with 400 if type, hasPropDistance, hasPropExercises parameters are missing', async () => {
    const newSportType = {
      type: '',
      hasPropDistance: '',
      hasPropExercises: '',
    };
    const response = await request(app)
      .post('/api/admin/sports')
      .send(newSportType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 400 if sport type is missing', async () => {
    const newSportType = {
      type: '',
      hasPropDistance: true,
      hasPropExercises: false,
    };
    const response = await request(app)
      .post('/api/admin/sports')
      .send(newSportType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 400 if hasPropDistance is missing', async () => {
    const newSportType = {
      type: 'Futás',
      hasPropDistance: '',
      hasPropExercises: false,
    };
    const response = await request(app)
      .post('/api/admin/sports')
      .send(newSportType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 400 if hasPropExercises is missing', async () => {
    const newSportType = {
      type: 'Futás',
      hasPropDistance: true,
      hasPropExercises: '',
    };
    const response = await request(app)
      .post('/api/admin/sports')
      .send(newSportType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 400 if sport type name is already taken', async () => {
    const newSportType = {
      type: 'Futás',
      hasPropDistance: true,
      hasPropExercises: false,
    };
    const response = await request(app)
      .post('/api/admin/sports')
      .send(newSportType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 200 and return the new sport type', (done) => {
    const newSportType = {
      type: 'Biciklizés',
      hasPropDistance: true,
      hasPropExercises: false,
    };
    request(app)
      .post('/api/admin/sports')
      .send(newSportType)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, data) => {
        if (err) return done(err);
        expect(data.body.type).toBe('Biciklizés');
        expect(data.body.hasPropDistance).toBe(true);
        expect(data.body.hasPropExercises).toBe(false);
        expect(data.body.id).toBeTruthy();
        return done();
      });
  });
});

describe('DELETE /api/admin/sports/:sportTypeId', () => {
  test('should respond with 401 if not an admin wants to delete a sport type', async () => {
    const invalidToken = 'cdg697c649dva649';
    const response = await request(app)
      .delete(`/api/admin/sports/${idOfFirstSportType}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(401);
  });

  test('should respond with 400 if sport type ID is not valid', async () => {
    const response = await request(app)
      .delete('/api/admin/sports/abc')
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 400 if sport type doesn\'t exist', async () => {
    const response = await request(app)
      .delete('/api/admin/sports/642d8b3a16e798e148a10000')
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with empty object if sport type is successfully deleted', async () => {
    const response = await request(app)
      .delete(`/api/admin/sports/${idOfFirstSportType}`)
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual('');
  });
});
