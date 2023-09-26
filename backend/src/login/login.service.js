import bcrypt from 'bcrypt';
import { UserModel } from '../user/user.model';
import createUserToken from '../user/createUserToken';

export const loginService = {
  async login({ email, password }) {
    const result = {};
    if (!email && !password) {
      const error = new Error('All fields are required.');
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
    } else {
      const user = await UserModel.findOne({ email });
      if (!user || !await bcrypt.compare(password, user.password)) {
        const error = new Error('Email or password is incorrect.');
        error.status = 400;
        throw error;
      } else {
        result.token = createUserToken(user);
      }
    }

    return result;
  },
};
