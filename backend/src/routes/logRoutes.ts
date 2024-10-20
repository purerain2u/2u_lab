import express from 'express';
import { logPageVisit } from '../controllers/logController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/log-visit', protect, logPageVisit);

export default router;