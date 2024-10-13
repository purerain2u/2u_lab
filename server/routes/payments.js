const express = require('express');
const axios = require('axios');
const router = express.Router();

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

router.post('/confirm', async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  try {
    const response = await axios.post(
      `${TOSS_API_URL}/${paymentKey}`,
      { orderId, amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Payment confirmation error:', error.response?.data || error.message);
    res.status(400).json(error.response?.data || { message: '결제 확인 중 오류가 발생했습니다.' });
  }
});

module.exports = router;