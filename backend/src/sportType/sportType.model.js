import mongoose from 'mongoose';

const sportTypeSchema = mongoose.Schema({
  type: String,
  hasPropDistance: Boolean,
  hasPropExercises: Boolean,
});

export const SportTypeModel = mongoose.model('SportType', sportTypeSchema);
