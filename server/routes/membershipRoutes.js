const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { protect } = require('../middleware/auth');

router.use(protect); // 모든 멤버십 라우트에 인증 미들웨어 적용

router.post('/', membershipController.createMembership);
router.get('/:userId', membershipController.getMembership);
router.patch('/:userId', membershipController.updateMembership);

module.exports = router;
