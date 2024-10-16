require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 서버 시작
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));

// 예기치 않은 에러 처리
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// 주의사항:
// 1. 환경 변수 설정: MONGODB_URI, JWT_SECRET, TOSS_SECRET_KEY, ALLOWED_ORIGIN을 반드시 설정하세요.
// 2. 프로덕션 환경에서는 추가적인 보안 조치를 취하세요 (예: HTTPS 사용).
