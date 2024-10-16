const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errorClasses');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('이미 등록된 이메일입니다.', 400));
    }
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    logger.info(`New user registered: ${user.email}`);
    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: user._id, username: user.username, email: user.email } }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    next(new AppError('회원가입에 실패했습니다.', 400));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return next(new AppError('이메일 또는 비밀번호가 올바르지 않습니다.', 401));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    logger.info(`User logged in: ${user.email}`);
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(new AppError('로그인에 실패했습니다.', 400));
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('로그인이 필요합니다.', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('해당 토큰의 사용자가 더 이상 존재하지 않습니다.', 401));
    }
    req.user = currentUser;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    next(new AppError('인증에 실패했습니다.', 401));
  }
};

exports.getProfile = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { 
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    }
  });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { username, email },
      {
        new: true,
        runValidators: true
      }
    );
    if (!updatedUser) {
      return next(new AppError('사용자를 찾을 수 없습니다.', 404));
    }
    logger.info(`User profile updated: ${updatedUser.email}`);
    res.status(200).json({
      status: 'success',
      data: { 
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email
        }
      }
    });
  } catch (error) {
    logger.error(`Profile update error: ${error.message}`);
    next(new AppError('프로필 업데이트에 실패했습니다.', 400));
  }
};
