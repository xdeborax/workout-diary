import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

const DB_URI = config.db.uri || 'mongodb://127.0.0.1:27017/';

mongoose.set('strictQuery', true);

try {
  mongoose.connect(DB_URI);
} catch (err) {
  if (err) logger.error(err.message);
}
logger.info('Successfully connected to MongoDB');
