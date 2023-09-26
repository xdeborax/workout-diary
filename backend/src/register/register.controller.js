import { registerService } from './register.service';

export const registerController = {
  async post(req, res, next) {
    const { name, email, password } = req.body;
    let result;
    try {
      result = await registerService.register({ name, email, password });
    } catch (err) {
      return next(err);
    }
    return res.status(200).json(result);
  },
};
