const Payment = require('../models/Payment');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errorClasses');
const axios = require('axios');

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

exports.createPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethod, orderId } = req.body;
    const payment = await Payment.create({
      userId: req.user._id,
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
    logger.error(`Payment creation error: ${error.message}`);
    next(new AppError('결제 생성에 실패했습니다.', 400));
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentKey, orderId, amount } = req.body;

    const response = await axios.post(
      `${TOSS_API_URL}/${paymentKey}`,
      { orderId, amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`
        }
      }
    );

    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { 
        status: 'completed',
        paymentKey: response.data.paymentKey,
        transactionId: response.data.transactionKey,
        paymentDetails: response.data
      },
      { new: true }
    );

    if (!payment) {
      return next(new AppError('해당 주문을 찾을 수 없습니다.', 404));
    }

    logger.info(`Payment confirmed: ${payment._id}`);
    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    logger.error(`Payment confirmation error: ${error.response ? error.response.data : error.message}`);
    next(new AppError('결제 확인에 실패했습니다.', 400));
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    logger.error(`Payment history fetch error: ${error.message}`);
    next(new AppError('결제 내역 조회에 실패했습니다.', 400));
  }
};

exports.getPaymentDetails = async (req, res, next) => {
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
    logger.error(`Payment details fetch error: ${error.message}`);
    next(new AppError('결제 상세 정보 조회에 실패했습니다.', 400));
  }
};

exports.cancelPayment = async (req, res, next) => {
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
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`
        }
      }
    );

    payment.status = 'cancelled';
    payment.cancelDetails = response.data;
    await payment.save();

    logger.info(`Payment cancelled: ${payment._id}`);
    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    logger.error(`Payment cancellation error: ${error.response ? error.response.data : error.message}`);
    next(new AppError('결제 취소에 실패했습니다.', 400));
  }
};
