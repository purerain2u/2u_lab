import express from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', userController.createUser as express.RequestHandler);
router.get('/:id', userController.getUser as express.RequestHandler);
router.delete('/:id', userController.deleteUser as express.RequestHandler);

router.use(protect);

router.get('/profile', userController.getProfile as express.RequestHandler);
router.patch('/profile', userController.updateProfile as express.RequestHandler);
router.get('/youtube-insights', userController.getYoutubeInsights as express.RequestHandler);
router.post('/record-visit', userController.recordPageVisit as express.RequestHandler);
router.get('/page-analytics', userController.getPageAnalytics as express.RequestHandler);

export default router;
