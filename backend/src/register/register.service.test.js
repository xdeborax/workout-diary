import { UserModel } from '../user/user.model';
import { registerService } from './register.service';

test('Register with valid data should return name, email and id', async () => {
  const userToRegister = {
    name: 'John Doe',
    email: 'johndoe1@test.com',
    password: 'password123',
  };

  jest.spyOn(UserModel, 'find').mockResolvedValue([]);
  jest.spyOn(UserModel, 'create').mockResolvedValue({
    name: 'John Doe',
    email: 'johndoe1@test.com',
    password: 'hashed password',
    _id: 'random id',
    __v: 0,
  });

  const result = await registerService.register(userToRegister);

  expect(result.name).toBe('John Doe');
  expect(result.email).toBe('johndoe1@test.com');
  expect(result._id).toBeUndefined();
  expect(result.__v).toBeUndefined();
  expect(result.id).toBeTruthy();
});

test('Register with empty fields should throw an error', async () => {
  const userToRegister = {};

  await expect(registerService.register(userToRegister)).rejects.toThrow();
});

test('Register without name should throw an error', async () => {
  const userToRegister = {
    email: 'johndoe2@test.com',
    password: 'password123',
  };

  await expect(registerService.register(userToRegister)).rejects.toThrow();
});

test('Register without email should throw an error', async () => {
  const userToRegister = {
    name: 'John Doe',
    password: 'password123',
  };

  await expect(registerService.register(userToRegister)).rejects.toThrow();
});

test('Register without password should throw an error', async () => {
  const userToRegister = {
    name: 'John Doe',
    email: 'johndoe3@test.com',
  };

  await expect(registerService.register(userToRegister)).rejects.toThrow();
});

test('Register with password which is under 8 character should throw an error', async () => {
  const userToRegister = {
    name: 'John Doe',
    email: 'johndoe4@test.com',
    password: '12345',
  };

  await expect(registerService.register(userToRegister)).rejects.toThrow();
});

test('Register with not valid email format should throw an error', async () => {
  const userToRegister = {
    name: 'John Doe',
    email: 'john.doe4@',
    password: 'password123',
  };

  await expect(registerService.register(userToRegister)).rejects.toThrow();
});

test('Register with taken email should throw an error', async () => {
  const userToRegister = {
    name: 'John Doe',
    email: 'johndoe5@test.com',
    password: 'password123',
  };

  jest.spyOn(UserModel, 'find').mockResolvedValue([
    {
      name: 'John Doe',
      email: 'johndoe5@test.com',
      password: 'hashed password',
      _id: 'random id',
      __v: 0,
    },
  ]);
  await expect(registerService.register(userToRegister)).rejects.toThrow();
});
