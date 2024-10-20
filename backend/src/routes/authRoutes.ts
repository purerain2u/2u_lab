import express from 'express';
import * as authController from '../controllers/authController';
import { validateRegistration, validate } from '../middleware/validatorMiddleware';
import { loginValidationRules } from '../utils/validators';

const router = express.Router();

// 회원가입
router.post('/register', validate(validateRegistration), authController.register);

// 이메일 인증
router.get('/verifyEmail/:token', authController.verifyEmail);

// 로그인
router.post('/login', validate(loginValidationRules), authController.login);

// 비밀번호 재설정 요청
router.post('/forgotPassword', authController.forgotPassword);

// 비밀번호 재설정
router.patch('/resetPassword/:token', authController.resetPassword);

// 사용자 프로필 조회
router.get('/profile', authController.protect, authController.getProfile);

// 사용자 프로필 수정
router.put('/profile', authController.protect, authController.updateProfile);

// 로그아웃
router.post('/logout', authController.protect, authController.logout);

// 토큰 갱신
router.post('/refresh-token', authController.refreshToken);

export default router;
