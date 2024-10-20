import { Request, Response, NextFunction } from 'express';
import Membership from '../models/Membership';
import logger from '../utils/logger';
import { AppError } from '../utils/errorClasses';

export const createMembership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, type, endDate } = req.body;
    const membership = await Membership.create({ userId, type, endDate });
    logger.info(`멤버십 생성 완료: ${membership.id}`);
    res.status(201).json({
      status: 'success',
      data: { membership }
    });
  } catch (error) {
    logger.error('멤버십 생성 중 오류:', error);
    next(new AppError('멤버십 생성 중 오류가 발생했습니다.', 400));
  }
};

export const getMembership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const membership = await Membership.findOne({ userId: req.params.userId, isActive: true });
    if (!membership) {
      logger.warn(`활성 멤버십 없음: userId ${req.params.userId}`);
      return next(new AppError('활성 멤버십을 찾을 수 없습니다.', 404));
    }
    logger.info(`멤버십 조회 완료: ${membership.id}`);
    res.status(200).json({
      status: 'success',
      data: { membership }
    });
  } catch (error) {
    logger.error('멤버십 조회 중 오류:', error);
    next(new AppError('멤버십 조회 중 오류가 발생했습니다.', 400));
  }
};

export const updateMembership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, endDate, isActive, autoRenew } = req.body;
    const membership = await Membership.findOneAndUpdate(
      { userId: req.params.userId, isActive: true },
      { type, endDate, isActive, autoRenew },
      { new: true, runValidators: true }
    );
    if (!membership) {
      logger.warn(`업데이트할 활성 멤버십 없음: userId ${req.params.userId}`);
      return next(new AppError('활성 멤버십을 찾을 수 없습니다.', 404));
    }
    logger.info(`멤버십 업데이트 완료: ${membership.id}`);
    res.status(200).json({
      status: 'success',
      data: { membership }
    });
  } catch (error) {
    logger.error('멤버십 업데이트 중 오류:', error);
    next(new AppError('멤버십 업데이트 중 오류가 발생했습니다.', 400));
  }
};

// 테스트를 위한 서비스 객체
export const membershipService = {
  create: Membership.create.bind(Membership),
  findOne: Membership.findOne.bind(Membership),
  findOneAndUpdate: Membership.findOneAndUpdate.bind(Membership)
};
