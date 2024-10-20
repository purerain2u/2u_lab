import { Request, Response, NextFunction } from 'express';
import Payment from '../models/Payment';
import logger from '../utils/logger';
import { AppError } from '../utils/errorClasses';
import axios from 'axios';
import { config } from '../config';
import { TossPaymentsService } from '../services/tossPaymentsService';
import { v4 as uuidv4 } from 'uuid';

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

const tossPaymentsService = new TossPaymentsService();

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, paymentMethod, orderId, membershipId } = req.body;
    const payment = await Payment.create({
      userId: req.user._id,
      membershipId,
      amount,
      paymentMethod,
      orderId,
      status: 'pending'
    });
    logger.info(`New payment created: ${payment._id}`);
    res.status(201).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    logger.error(`Payment creation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new AppError('결제 생성에 실패했습니다.', 400));
  }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentKey, orderId, amount } = req.body;

    const response = await axios.post(
      `${TOSS_API_URL}/${paymentKey}`,
      { orderId, amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return next(new AppError('결제 정보를 찾을 수 없습니다.', 404));
    }

    await payment.completePayment(paymentKey, response.data.transactionKey, response.data);

    logger.info(`Payment confirmed: ${payment._id}`);
    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    logger.error(`Payment confirmation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new AppError('결제 확인에 실패했습니다.', 400));
  }
};

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    logger.error(`Payment history fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new AppError('결제 내역 조회에 실패했습니다.', 400));
  }
};

export const getPaymentDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.paymentId, userId: req.user._id });
    if (!payment) {
      return next(new AppError('해당 결제를 찾을 수 없습니다.', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    logger.error(`Payment details fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new AppError('결제 상세 정보 조회에 실패했습니다.', 400));
  }
};

export const cancelPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.paymentId, userId: req.user._id });
    if (!payment) {
      return next(new AppError('해당 결제를 찾을 수 없습니다.', 404));
    }

    if (payment.status !== 'completed') {
      return next(new AppError('완료된 결제만 취소할 수 있습니다.', 400));
    }

    const response = await axios.post(
      `${TOSS_API_URL}/${payment.paymentKey}/cancel`,
      { cancelReason: '사용자 요청' },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    await payment.cancelPayment(response.data);

    logger.info(`Payment cancelled: ${payment._id}`);
    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    logger.error(`Payment cancellation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new AppError('결제 취소에 실패했습니다.', 400));
  }
};

export const getTotalPaymentsByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalPayments = await Payment.getTotalPaymentsByUser(req.user._id);
    res.status(200).json({
      status: 'success',
      data: { totalPayments: totalPayments[0]?.total || 0 }
    });
  } catch (error) {
    logger.error(`Total payments fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new AppError('총 결제 금액 조회에 실패했습니다.', 400));
  }
};

export const createPaymentRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, orderName, customerName, paymentMethod } = req.body;
    const orderId = uuidv4();
    const successUrl = `${req.protocol}://${req.get('host')}/api/payments/success`;
    const failUrl = `${req.protocol}://${req.get('host')}/api/payments/fail`;

    const paymentRequest = await tossPaymentsService.createPaymentRequest({
      amount,
      orderId,
      orderName,
      customerName,
      successUrl,
      failUrl,
      paymentMethod,
    });

    res.status(200).json({
      status: 'success',
      data: paymentRequest
    });
  } catch (error) {
    logger.error('결제 요청 생성 중 오류:', error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('결제 요청 생성 중 예기치 못한 오류가 발생했습니다.', 500));
  }
};

export const handlePaymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentKey, orderId, amount } = req.query;
    
    if (typeof paymentKey !== 'string' || typeof orderId !== 'string' || typeof amount !== 'string') {
      throw new AppError('잘못된 요청입니다.', 400);
    }

    const payment = await tossPaymentsService.confirmPayment(paymentKey, orderId, parseInt(amount, 10));

    res.status(200).json({
      status: 'success',
      data: payment
    });
  } catch (error) {
    logger.error('결제 확인 중 오류:', error);
    next(new AppError('결제 확인 중 오류가 발생했습니다.', 400));
  }
};

export const handlePaymentFail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, message, orderId } = req.query;

    logger.warn(`결제 실패: code=${code}, message=${message}, orderId=${orderId}`);

    res.status(400).json({
      status: 'fail',
      message: '결제에 실패했습니다.',
      error: { code, message, orderId }
    });
  } catch (error) {
    logger.error('결제 실패 처리 중 오류:', error);
    next(new AppError('결제 실패 처리 중 오류가 발생했습니다.', 500));
  }
};

export const getPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentKey } = req.params;
    const paymentStatus = await tossPaymentsService.getPaymentStatus(paymentKey);
    res.status(200).json({
      status: 'success',
      data: paymentStatus
    });
  } catch (error) {
    logger.error('결제 상태 조회 중 오류:', error);
    next(new AppError('결제 상태 조회 중 오류가 발생했습니다.', 400));
  }
};
