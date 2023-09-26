import { loginService } from './login.service';

export const loginController = {
  async post(req, res, next) {
    const { email, password } = req.body;
    let result;
    try {
      result = await loginService.login({ email, password });
    } catch (err) {
      return next(err);
    }
    return res.status(200).json(result);
  },
};
