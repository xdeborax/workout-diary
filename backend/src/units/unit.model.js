import mongoose from 'mongoose';

const unitSchema = mongoose.Schema({
  unitName: String,
  unitValue: [String],
});

export const UnitModel = mongoose.model('Unit', unitSchema);
