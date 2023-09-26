import { UnitModel } from './unit.model';

export const unitService = {
  async getUnits() {
    const unitList = await UnitModel.find({});
    const result = unitList.map((unit) => ({
      id: unit._id,
      unitName: unit.unitName,
      unitValue: unit.unitValue,
    }));
    return result;
  },
};
