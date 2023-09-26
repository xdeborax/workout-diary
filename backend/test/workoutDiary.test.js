import request from 'supertest';
import mongoose from 'mongoose';
import logger from '../src/logger';
import app from '../src/app';
import config from '../src/config';
import { UserModel } from '../src/user/user.model';

const DB_URI = `${config.testDb.uri}_diaries`;

let token;
let workoutIdToRemove;
let workoutIdToEdit;
let tokenNew;

const firstWorkoutToAdd = {
  sportType: 'Futás',
  workoutName: 'tempó futás',
  date: '2023-03-19',
  duration: 1,
  distance: 7,
  note: 'jó volt a sebesség',
  durationUnit: 'óra',
  distanceUnit: 'km',
  isDone: true,
};

const secondWorkoutToAdd = {
  sportType: 'Erősítő edzés',
  workoutName: 'láb nap',
  date: '2023-03-24',
  duration: 1,
  note: 'fejlődés az ismétlés számokkal',
  durationUnit: 'óra',
  exercises: [
    {
      exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12,
    },
    {
      exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20,
    },
    {
      exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13,
    },
  ],
  isDone: true,
};

beforeAll(async () => {
  mongoose.set('strictQuery', true);
  const connectionResult = await mongoose.connect(DB_URI);
  logger.info(`Connected to ${connectionResult.connection.name} database`);

  const userToRegister = {
    name: 'Joe',
    email: 'joe@joe.com',
    password: '$2b$10$ywaNE50jZV7frXFIA0e72uLJUa6GbH48i5OJmAg2Zggr42JD2ehpe',
    isVerified: true,
  };
  await UserModel.create(userToRegister);
  jest.replaceProperty(config, 'jwtSecret', 'superjwtsecret');

  const response = await request(app).post('/api/login').send({
    email: 'joe@joe.com',
    password: '123456789',
  });
  token = response.body.token;

  const secondUserToRegister = {
    name: 'Test',
    email: 'test@test.com',
    password: '$2b$10$5uevZWZWJK1.PkVRlh3hZu450kOPoo0qXg2queHDwaP6b92Yz/dv.',
    isVerified: true,
  };
  await UserModel.create(secondUserToRegister);

  const res = await request(app).post('/api/login').send({
    email: 'test@test.com',
    password: '123456789',
  });
  tokenNew = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/diaries', () => {
  test('should respond with 401 if token is invalid', async () => {
    const invalidToken = 'cdg697c649dva649';
    const response = await request(app)
      .post('/api/diaries')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(401);
  });

  test('should respond with 400 if sport type, date, duration and duration unit are not provided', async () => {
    const response = await request(app)
      .post('/api/diaries')
      .send({
        ...firstWorkoutToAdd, sportType: null, date: null, duration: null, durationUnit: null,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should response with 200 and the new workout diary with the currently added workout in it', async () => {
    const response = await request(app)
      .post('/api/diaries')
      .send({ ...firstWorkoutToAdd })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);

    expect(response.status).toEqual(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.workouts[0].sportType).toBe('Futás');
    expect(response.body.workouts[0].workoutName).toBe('tempó futás');
    expect(response.body.workouts[0].date).toBe('2023-03-19T00:00:00.000Z');
    expect(response.body.workouts[0].duration).toBe(1);
    expect(response.body.workouts[0].distance).toBe(7);
    expect(response.body.workouts[0].note).toBe('jó volt a sebesség');
    expect(response.body.workouts[0].durationUnit).toBe('óra');
    expect(response.body.workouts[0].distanceUnit).toBe('km');
    expect(response.body.workouts[0].isDone).toBeTruthy();
  });

  test('should response with 200 and the workout diary with the currently added and previous workouts in it', async () => {
    const response = await request(app)
      .post('/api/diaries')
      .send({ ...secondWorkoutToAdd })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.workouts[0].sportType).toBe('Futás');
    expect(response.body.workouts[0].workoutName).toBe('tempó futás');
    expect(response.body.workouts[0].date).toBe('2023-03-19T00:00:00.000Z');
    expect(response.body.workouts[0].duration).toBe(1);
    expect(response.body.workouts[0].distance).toBe(7);
    expect(response.body.workouts[0].note).toBe('jó volt a sebesség');
    expect(response.body.workouts[0].durationUnit).toBe('óra');
    expect(response.body.workouts[0].distanceUnit).toBe('km');
    expect(response.body.workouts[0].isDone).toBeTruthy();
    expect(response.body.workouts[1].sportType).toBe('Erősítő edzés');
    expect(response.body.workouts[1].workoutName).toBe('láb nap');
    expect(response.body.workouts[1].date).toBe('2023-03-24T00:00:00.000Z');
    expect(response.body.workouts[1].duration).toBe(1);
    expect(response.body.workouts[1].note).toBe('fejlődés az ismétlés számokkal');
    expect(response.body.workouts[1].durationUnit).toBe('óra');
    expect(response.body.workouts[1].exercises[0].exerciseName).toBe('guggolás');
    expect(response.body.workouts[1].exercises[0].weight).toBe(30);
    expect(response.body.workouts[1].exercises[0].sets).toBe(4);
    expect(response.body.workouts[1].exercises[0].reps).toBe(12);
    expect(response.body.workouts[1].exercises[1].exerciseName).toBe('kitörés');
    expect(response.body.workouts[1].exercises[1].weight).toBe(10);
    expect(response.body.workouts[1].exercises[1].sets).toBe(4);
    expect(response.body.workouts[1].exercises[1].reps).toBe(20);
    expect(response.body.workouts[1].exercises[2].exerciseName).toBe('lábtolás');
    expect(response.body.workouts[1].exercises[2].weight).toBe(30);
    expect(response.body.workouts[1].exercises[2].sets).toBe(4);
    expect(response.body.workouts[1].exercises[2].reps).toBe(13);
    expect(response.body.workouts[1].isDone).toBeTruthy();

    workoutIdToRemove = response.body.workouts[1].id;
    workoutIdToEdit = response.body.workouts[0].id;
  });
});

describe('GET /api/diaries', () => {
  test('should respond with 401 if token is invalid', async () => {
    const invalidToken = 'cdg697c649dva649';
    const response = await request(app)
      .get('/api/diaries')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(401);
  });

  test('should respond with 200 and returns the workouts of the user', async () => {
    const response = await request(app)
      .get('/api/diaries')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.workouts[1].sportType).toBe('Futás');
    expect(response.body.workouts[1].workoutName).toBe('tempó futás');
    expect(response.body.workouts[1].date).toBe('2023-03-19T00:00:00.000Z');
    expect(response.body.workouts[1].duration).toBe(1);
    expect(response.body.workouts[1].distance).toBe(7);
    expect(response.body.workouts[1].note).toBe('jó volt a sebesség');
    expect(response.body.workouts[1].durationUnit).toBe('óra');
    expect(response.body.workouts[1].distanceUnit).toBe('km');
    expect(response.body.workouts[1].isDone).toBeTruthy();
    expect(response.body.workouts[0].sportType).toBe('Erősítő edzés');
    expect(response.body.workouts[0].workoutName).toBe('láb nap');
    expect(response.body.workouts[0].date).toBe('2023-03-24T00:00:00.000Z');
    expect(response.body.workouts[0].duration).toBe(1);
    expect(response.body.workouts[0].note).toBe('fejlődés az ismétlés számokkal');
    expect(response.body.workouts[0].durationUnit).toBe('óra');
    expect(response.body.workouts[0].exercises[0].exerciseName).toBe('guggolás');
    expect(response.body.workouts[0].exercises[0].weight).toBe(30);
    expect(response.body.workouts[0].exercises[0].sets).toBe(4);
    expect(response.body.workouts[0].exercises[0].reps).toBe(12);
    expect(response.body.workouts[0].exercises[1].exerciseName).toBe('kitörés');
    expect(response.body.workouts[0].exercises[1].weight).toBe(10);
    expect(response.body.workouts[0].exercises[1].sets).toBe(4);
    expect(response.body.workouts[0].exercises[1].reps).toBe(20);
    expect(response.body.workouts[0].exercises[2].exerciseName).toBe('lábtolás');
    expect(response.body.workouts[0].exercises[2].weight).toBe(30);
    expect(response.body.workouts[0].exercises[2].sets).toBe(4);
    expect(response.body.workouts[0].exercises[2].reps).toBe(13);
    expect(response.body.workouts[0].isDone).toBeTruthy();
  });

  test('should respond with 200 and returns an empty array if there is no workouts of the user', async () => {
    const response = await request(app)
      .get('/api/diaries')
      .set('Authorization', `Bearer ${tokenNew}`)
      .send()
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.workouts).toEqual([]);
  });
});

describe('PATCH /api/diaries', () => {
  test('should respond with 401 if token is invalid', async () => {
    const invalidToken = 'cdg697c649dva649';

    const response = await request(app)
      .patch('/api/diaries')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ workoutId: workoutIdToRemove })
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(401);
  });

  test('should respond with 400 if workoutId is invalid', async () => {
    const response = await request(app)
      .patch('/api/diaries')
      .set('Authorization', `Bearer ${token}`)
      .send({ workoutId: 'abc' })
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 200 and the workout diary without the removed workout', async () => {
    const response = await request(app)
      .patch('/api/diaries')
      .set('Authorization', `Bearer ${token}`)
      .send({ workoutId: workoutIdToRemove })
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.workouts[0].sportType).toBe('Futás');
    expect(response.body.workouts[0].workoutName).toBe('tempó futás');
    expect(response.body.workouts[0].date).toBe('2023-03-19T00:00:00.000Z');
    expect(response.body.workouts[0].duration).toBe(1);
    expect(response.body.workouts[0].distance).toBe(7);
    expect(response.body.workouts[0].note).toBe('jó volt a sebesség');
    expect(response.body.workouts[0].durationUnit).toBe('óra');
    expect(response.body.workouts[0].distanceUnit).toBe('km');
    expect(response.body.workouts[0].isDone).toBeTruthy();
  });
});

describe('PATCH /api/diaries/:workoutId', () => {
  const workoutToEdit = {
    sportType: 'Futás',
    workoutName: 'lassú futás',
    date: '2023-03-19',
    duration: 1,
    distance: 3,
    note: 'sebesség lassú volt',
    durationUnit: 'óra',
    distanceUnit: 'km',
    isDone: true,
  };

  test('should respond with 401 if token is invalid', async () => {
    const invalidToken = 'cdg697c649dva649';
    const response = await request(app)
      .patch(`/api/diaries/${workoutIdToEdit}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(workoutToEdit)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(401);
  });

  test('should respond with 400 if workoutId is invalid', async () => {
    const response = await request(app)
      .patch('/api/diaries/abc')
      .set('Authorization', `Bearer ${token}`)
      .send(workoutToEdit)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(400);
  });

  test('should respond with 200 and the workout diary with the previous workouts and the edited one', async () => {
    const response = await request(app)
      .patch(`/api/diaries/${workoutIdToEdit}`)
      .set('Authorization', `Bearer ${token}`)
      .send(workoutToEdit)
      .expect('Content-Type', /json/);
    expect(response.status).toEqual(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.workouts[0].sportType).toBe('Futás');
    expect(response.body.workouts[0].workoutName).toBe('lassú futás');
    expect(response.body.workouts[0].date).toBe('2023-03-19T00:00:00.000Z');
    expect(response.body.workouts[0].duration).toBe(1);
    expect(response.body.workouts[0].distance).toBe(3);
    expect(response.body.workouts[0].note).toBe('sebesség lassú volt');
    expect(response.body.workouts[0].durationUnit).toBe('óra');
    expect(response.body.workouts[0].distanceUnit).toBe('km');
    expect(response.body.workouts[0].isDone).toBeTruthy();
  });
});
