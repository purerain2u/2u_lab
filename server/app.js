const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// 라우트 파일 불러오기
const userRoutes = require('./routes/userRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config(); // .env 파일에서 환경 변수 로드

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// 속도 제한 설정
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 15분 동안 최대 100개의 요청
});
app.use('/api', limiter);

// MongoDB 연결
const uri = process.env.MONGODB_URI || "mongodb+srv://2usttg4:20191028eu!@cluster0.7t5yp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/payments', paymentRoutes);

// API 문서화
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
