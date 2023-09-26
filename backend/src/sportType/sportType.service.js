import mongoose from 'mongoose';
import { SportTypeModel } from './sportType.model';

export const sportTypeService = {
  async getSportTypes() {
    const sportList = await SportTypeModel.find({}).sort({ type: 1 });
    const result = sportList.map((sport) => ({
      id: sport._id,
      type: sport.type,
      hasPropDistance: sport.hasPropDistance,
      hasPropExercises: sport.hasPropExercises,
    }));
    return result;
  },
  async addSportType({ type, hasPropDistance, hasPropExercises }) {
    if (!type && !hasPropDistance && !hasPropExercises) {
      const error = new Error('Sport type, hasPropDistance and hasPropExercises parameters are required');
      error.status = 400;
      throw error;
    }
    if (!type) {
      const error = new Error('Type is required.');
      error.status = 400;
      throw error;
    }
    if (type.length > 30) {
      const error = new Error('Type can be max. 30 characters');
      error.status = 400;
      throw error;
    }
    if (!hasPropDistance && hasPropDistance !== false) {
      const error = new Error('hasPropDistance is required');
      error.status = 400;
      throw error;
    }
    if (!hasPropExercises && hasPropExercises !== false) {
      const error = new Error('hasPropExercises is required');
      error.status = 400;
      throw error;
    }
    const isTypeNameTaken = (await SportTypeModel.findOne({ type }));
    if (isTypeNameTaken && isTypeNameTaken.type === type) {
      const error = new Error('Megadott sport típus már létezik');
      error.status = 400;
      throw error;
    }
    const sport = await SportTypeModel.create({ type, hasPropDistance, hasPropExercises });
    const result = {
      id: sport._id,
      type: sport.type.charAt(0).toUpperCase() + sport.type.slice(1),
      hasPropDistance: sport.hasPropDistance,
      hasPropExercises: sport.hasPropExercises,
    };
    return result;
  },
  async deleteSportType({ sportTypeId }) {
    if (!sportTypeId) {
      const error = new Error('Sport type ID is required.');
      error.status = 400;
      throw error;
    }
    if (!mongoose.isValidObjectId(sportTypeId)
      || !(await SportTypeModel.findOne({ _id: sportTypeId }))) {
      const error = new Error('Sport type doesn\'t exist.');
      error.status = 400;
      throw error;
    }
    await SportTypeModel.deleteOne({ _id: sportTypeId });
  },
};
