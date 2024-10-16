const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorClasses');

exports.protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError('인증이 필요합니다.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    next(new AppError('유효하지 않은 토큰입니다.', 401));
  }
};