const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/page-view', analyticsController.recordPageView);
router.get('/page', restrictTo('admin'), analyticsController.getPageAnalytics);
router.get('/user/:userId', restrictTo('admin'), analyticsController.getUserAnalytics);
router.get('/overall', restrictTo('admin'), analyticsController.getOverallAnalytics);
router.patch('/user/:userId', analyticsController.updateUserAnalytics);
router.get('/payment', restrictTo('admin'), analyticsController.getPaymentAnalytics);

module.exports = router;
