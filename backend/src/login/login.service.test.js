import bcrypt from 'bcrypt';
import { UserModel } from '../user/user.model';
import { loginService } from './login.service';
import config from '../config';

test('Login with empty fields should throw error', async () => {
  const userToLogin = {};

  await expect(loginService.login(userToLogin)).rejects.toThrow();
});

test('Login without email should throw error', async () => {
  const userToLogin = {
    password: 'password123',
  };

  await expect(loginService.login(userToLogin)).rejects.toThrow();
});

test('Login without password should throw error', async () => {
  const userToLogin = {
    email: 'johndoe6@test.com',
  };

  await expect(loginService.login(userToLogin)).rejects.toThrow();
});

test('Login with invalid email and password combination should throw error', async () => {
  const userToLogin = {
    email: 'johndoe7@test.com',
    password: '12',
  };

  jest.spyOn(UserModel, 'findOne').mockResolvedValue(
    {
      name: 'John Doe',
      email: 'johndoe7@test.com',
      password: '$2b$10$3NP3h9YD8DZizp/mXJ4X6O7JpfGn181uogqH9fE4GOUy.YPJx84Pi',
      _id: 'random id',
      __v: 0,
    },
  );

  jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

  await expect(loginService.login(userToLogin)).rejects.toThrow();
});

test('Login with valid email and password combination should return a JWT token', async () => {
  const userToLogin = {
    email: 'johndoe8@test.com',
    password: '12345678',
  };
  jest.replaceProperty(config, 'jwtSecret', 'superjwtsecret');
  jest.spyOn(UserModel, 'findOne').mockResolvedValue(
    {
      name: 'John Doe',
      email: 'johndoe8@test.com',
      password: '$2b$10$3NP3h9YD8DZizp/mXJ4X6O7JpfGn181uogqH9fE4GOUy.YPJx84Pi',
      _id: 'random id',
      __v: 0,
    },
  );

  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

  const result = await loginService.login(userToLogin);

  expect(result.token).toBeTruthy();
});
