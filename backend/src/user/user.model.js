import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = mongoose.model('UserModel', userSchema, 'users');
