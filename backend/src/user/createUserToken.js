import jwt from 'jsonwebtoken';
import config from '../config';

export default function createUserToken(user) {
  const userToken = jwt.sign({
    userId: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  }, config.jwtSecret);

  return userToken;
}
