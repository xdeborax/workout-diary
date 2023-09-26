import { unitService } from './unit.service';

export const unitController = {
  async get(req, res, next) {
    try {
      const unitList = await unitService.getUnits();
      const result = { units: unitList };
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
