import express from 'express';
import { getSystemStatus } from '../heartbeat/heartbeat.controller';

const router = express.Router();

router.get('/heartbeat', getSystemStatus);

export default router;
