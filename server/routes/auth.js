const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidationRules, loginValidationRules, validate } = require('../utils/validators');

// 회원가입
router.post('/register', registerValidationRules(), validate, authController.register);

// 로그인
router.post('/login', loginValidationRules(), validate, authController.login);

// 사용자 프로필 조회
router.get('/profile', authController.protect, authController.getProfile);

// 사용자 프로필 수정
router.put('/profile', authController.protect, authController.updateProfile);

// 로그아웃
router.post('/logout', authController.protect, authController.logout);

// 토큰 갱신
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
