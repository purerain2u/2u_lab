require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const paymentsRouter = require('./routes/payments');

const app = express();

// 미들웨어 설정
app.use(helmet()); // 보안 강화
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true
}));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 라우터 설정
app.use('/api/payments', paymentsRouter);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));

// 주의사항:
// 1. 환경 변수 설정: MONGODB_URI, JWT_SECRET, TOSS_SECRET_KEY, ALLOWED_ORIGIN을 반드시 설정하세요.
// 2. auth.router.js 파일을 새로 만들어 회원가입과 로그인 로직을 옮기세요.
// 3. 프로덕션 환경에서는 추가적인 보안 조치를 취하세요 (예: HTTPS 사용).