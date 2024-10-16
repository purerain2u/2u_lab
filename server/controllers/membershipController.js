const Membership = require('../models/Membership');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errorClasses');

exports.createMembership = async (req, res, next) => {
  try {
    const { userId, type, endDate } = req.body;
    const membership = await Membership.create({ userId, type, endDate });
    res.status(201).json({
      status: 'success',
      data: { membership }
    });
  } catch (error) {
    next(new AppError('멤버십 생성 중 오류가 발생했습니다.', 400));
  }
};

exports.getMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({ userId: req.params.userId, isActive: true });
    if (!membership) {
      return next(new AppError('활성 멤버십을 찾을 수 없습니다.', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { membership }
    });
  } catch (error) {
    next(new AppError('멤버십 조회 중 오류가 발생했습니다.', 400));
  }
};

exports.updateMembership = async (req, res, next) => {
  try {
    const { type, endDate, isActive, autoRenew } = req.body;
    const membership = await Membership.findOneAndUpdate(
      { userId: req.params.userId, isActive: true },
      { type, endDate, isActive, autoRenew },
      { new: true, runValidators: true }
    );
    if (!membership) {
      return next(new AppError('활성 멤버십을 찾을 수 없습니다.', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { membership }
    });
  } catch (error) {
    next(new AppError('멤버십 업데이트 중 오류가 발생했습니다.', 400));
  }
};
