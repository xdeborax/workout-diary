import jwt from 'jsonwebtoken';
import config from '../config';

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      res.status(403).send('A hozzáférés megtagadva.');
    }
    const decodedToken = await jwt.verify(token, config.jwtSecret);
    req.headers = { ...req.headers, loggedInUserData: decodedToken };
    next();
  } catch (err) {
    err.status = 401;
    err.message = {
      status: 'error',
      message: 'Invalid token',
    };
    next(err);
  }
};
