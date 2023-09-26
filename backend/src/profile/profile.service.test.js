import bcrypt from 'bcrypt';
import { UserModel } from '../user/user.model';
import { profileService } from './profile.service';
import config from '../config';

test('Update without name and password should throw error', async () => {
  const userToUpdate = {
    email: 'test@test.hu',
    _id: 'random id',
  };

  await expect(profileService.updateProfile(userToUpdate)).rejects.toThrow();
});

test('Update with password that has less then 8 characters should throw error', async () => {
  const userToUpdate = {
    email: 'test@test.hu',
    _id: 'random id',
    password: '1234567',
  };

  await expect(profileService.updateProfile(userToUpdate)).rejects.toThrow();
});

test('Updating name should return the users new name, the email, the id and a new token', async () => {
  const userToUpdate = {
    name: 'John Doe Junior',
  };
  jest.replaceProperty(config, 'jwtSecret', 'superjwtsecret');
  jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue({
    name: 'John Doe Junior',
    email: 'test@test.hu',
    password: 'hashed password',
    _id: 'random id',
    __v: 0,
    token: 'eyJhbGciOiJIUzI1N_Z4eJU_mb8ChMoP-5l8PnnA',
  });

  const result = await profileService.updateProfile(userToUpdate);

  await expect(result.name).toBe('John Doe Junior');
  await expect(result.email).toBe('test@test.hu');
  await expect(result.id).toBe('random id');
  await expect(result.token).toBeTruthy();
});

test('Updating password should create a hashed password', async () => {
  const userToUpdate = {
    password: '123456789',
  };
  const hashPassword = jest.spyOn(bcrypt, 'hash');
  jest.replaceProperty(config, 'jwtSecret', 'superjwtsecret');
  jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue({
    name: 'John Doe',
    email: 'test@test.hu',
    password: 'hashed password',
    _id: 'random id',
    __v: 0,
  });

  await profileService.updateProfile(userToUpdate);

  expect(hashPassword).toHaveBeenCalled();
});

test('Updating password should return the users name, the email and id, but not the new password', async () => {
  const userToUpdate = {
    password: '123456789',
  };
  jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed password');
  jest.replaceProperty(config, 'jwtSecret', 'superjwtsecret');
  jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue({
    name: 'John Doe',
    email: 'test@test.hu',
    password: 'hashed password',
    _id: 'random id',
    __v: 0,
    token: 'eyJhbGciOiJIUzI1N_Z4eJU_mb8ChMoP-5l8PnnA',
  });

  const result = await profileService.updateProfile(userToUpdate);

  await expect(result.name).toBe('John Doe');
  await expect(result.email).toBe('test@test.hu');
  await expect(result.id).toBe('random id');
  await expect(result.password).toBeUndefined();
  await expect(result.token).toBeTruthy();
});
