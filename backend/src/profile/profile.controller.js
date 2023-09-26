import { profileService } from './profile.service';

export const profileController = {
  async patch(req, res, next) {
    const { name, password, email } = req.body;
    const { userId } = req.headers.loggedInUserData;
    let result;
    try {
      result = await profileService.updateProfile({
        name, password, email, userId,
      });
    } catch (err) {
      return next(err);
    }
    return res.status(200).json(result);
  },
};
