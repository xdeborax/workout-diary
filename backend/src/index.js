import logger from './logger';
import config from './config';
import './db';
import app from './app';

const PORT = config.port || 8080;

app.listen(PORT, () => {
  logger.info(`App is listening on ${PORT}`);
});
