import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { swaggerOptions } from '../config';

const router = express.Router();
const specs = swaggerJsDoc(swaggerOptions);

router.use(swaggerUI.serve, swaggerUI.setup(specs));

export default router;
