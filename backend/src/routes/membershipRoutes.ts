import express from 'express';
import * as membershipController from '../controllers/membershipController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// 모든 멤버십 라우트에 인증 미들웨어 적용
router.use(protect);

router.post('/', membershipController.createMembership);
router.get('/:userId', membershipController.getMembership);
router.patch('/:userId', membershipController.updateMembership);

export default router;