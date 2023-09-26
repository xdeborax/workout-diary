import bcrypt from 'bcrypt';
import { UserModel } from '../user/user.model';
import createUserToken from '../user/createUserToken';

export const profileService = {
  async updateProfile({
    name, password, email, userId,
  }) {
    const result = {};

    if (!name && !password) {
      const error = new Error('Legalább egy mező kitöltése szükséges.');
      error.status = 400;
      throw error;
    }
    const newUser = {};
    newUser.email = email;

    if (name) {
      newUser.name = name;
    }
    if (password) {
      if (password.length < 8) {
        const error = new Error('A jelszónak minimum 8 karakternek kell lennie.');
        error.status = 400;
        throw error;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      newUser.password = hashedPassword;
    }

    const user = await UserModel.findOneAndUpdate({ _id: userId }, newUser, {
      new: true,
    });

    result.id = user._id;
    result.name = user.name;
    result.email = user.email;
    result.token = createUserToken(user);

    return result;
  },
};
