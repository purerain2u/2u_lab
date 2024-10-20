import express from 'express';
import axios from 'axios';
import Payment from '../models/Payment';
import { protect } from '../middleware/authMiddleware';
import { config } from '../config';
import { createPaymentRequest, handlePaymentSuccess, handlePaymentFail } from '../controllers/paymentController';

const router = express.Router();

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

// 결제 확인
router.post('/confirm', protect, async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  try {
    const response = await axios.post(
      `${TOSS_API_URL}/${paymentKey}`,
      { orderId, amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`
        }
      }
    );

    // 결제 정보를 데이터베이스에 저장
    const payment = new Payment({
      userId: req.user._id,
      amount: amount,
      paymentMethod: 'toss',
      status: 'completed',
      transactionId: response.data.paymentKey
    });
    await payment.save();

    res.json(response.data);
  } catch (error: any) {
    console.error('Payment confirmation error:', error.response?.data || error.message);
    res.status(400).json(error.response?.data || { message: '결제 확인 중 오류가 발생했습니다.' });
  }
});

// 결제 생성
router.post('/create', protect, async (req, res) => {
  const { amount, paymentMethod } = req.body;

  try {
    const payment = new Payment({
      userId: req.user._id,
      amount,
      paymentMethod,
      status: 'pending'
    });
    await payment.save();

    res.status(201).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(400).json({ message: '결제 생성 중 오류가 발생했습니다.' });
  }
});

// 결제 내역 조회
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    console.error('Payment history fetch error:', error);
    res.status(400).json({ message: '결제 내역 조회 중 오류가 발생했습니다.' });
  }
});

// 결제 요청 생성
router.post('/request', createPaymentRequest);

// 결제 성공 처리
router.get('/success', handlePaymentSuccess);

// 결제 실패 처리
router.get('/fail', handlePaymentFail);

export default router;
