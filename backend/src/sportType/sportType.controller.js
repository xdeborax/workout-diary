import { sportTypeService } from './sportType.service';

export const sportTypeController = {
  async get(req, res, next) {
    try {
      const sportTypes = await sportTypeService.getSportTypes();
      const result = { sportTypes };
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },
  async post(req, res, next) {
    const { type, hasPropDistance, hasPropExercises } = req.body;
    try {
      const addedSportType = await sportTypeService.addSportType(
        {
          type,
          hasPropDistance,
          hasPropExercises,
        },
      );
      const result = addedSportType;
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    const { sportTypeId } = req.params;
    try {
      await sportTypeService.deleteSportType({ sportTypeId });
      return res.status(200).json();
    } catch (error) {
      return next(error);
    }
  },
};
