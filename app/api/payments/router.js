// read-only
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../utils/auth');
const { confirmPayment } = require('../../membership/payment/toss-payment/payments.controller');

router.get('/confirm', verifyToken, async (req, res) => {
  try {
    const result = await confirmPayment(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
