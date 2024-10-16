const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser);

router.use(authMiddleware); // 이 미들웨어 이후의 라우트는 인증이 필요합니다.

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/youtube-insights', userController.getYoutubeInsights);
router.post('/record-visit', userController.recordPageVisit);
router.get('/page-analytics', userController.getPageAnalytics);

module.exports = router;
