import bcrypt from 'bcrypt';
import validator from 'validator';
import { UserModel } from '../user/user.model';

export const registerService = {
  async register({ name, email, password }) {
    const result = {};

    if (!name && !email && !password) {
      const error = new Error('Name, email and password are required.');
      error.status = 400;
      throw error;
    } else if (!name) {
      const error = new Error('Name is required.');
      error.status = 400;
      throw error;
    } else if (!email) {
      const error = new Error('Email is required.');
      error.status = 400;
      throw error;
    } else if (!password) {
      const error = new Error('Password is required.');
      error.status = 400;
      throw error;
    } else if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters.');
      error.status = 400;
      throw error;
    } else if (!validator.isEmail(email)) {
      const error = new Error('Not a valid email format.');
      error.status = 400;
      throw error;
    } else {
      const isEmailTaken = (await UserModel.find({ email })).length > 0;
      if (isEmailTaken) {
        const error = new Error('Email is already taken.');
        error.status = 400;
        throw error;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    result.id = (await UserModel.create({ name, email, password: hashedPassword }))._id;
    result.name = name;
    result.email = email;

    return result;
  },
};
