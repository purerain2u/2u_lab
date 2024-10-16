const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  membershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'KRW'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentKey: {
    type: String,
    unique: true,
    sparse: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  cancelDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  refundAmount: {
    type: Number
  },
  refundReason: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  analyticsData: {
    conversionTime: { type: Number },
    referralSource: { type: String },
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'] }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 생성
paymentSchema.index({ orderId: 1, paymentKey: 1 });

// 가상 필드: 결제 후 경과 시간 (시간 단위)
paymentSchema.virtual('hoursSincePayment').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// 결제 완료 메서드
paymentSchema.methods.completePayment = function(paymentKey, transactionId, paymentDetails) {
  this.status = 'completed';
  this.paymentKey = paymentKey;
  this.transactionId = transactionId;
  this.paymentDetails = paymentDetails;
  return this.save();
};

// 결제 취소 메서드
paymentSchema.methods.cancelPayment = function(cancelDetails) {
  this.status = 'cancelled';
  this.cancelDetails = cancelDetails;
  return this.save();
};

// 환불 메서드
paymentSchema.methods.refundPayment = function(refundAmount, refundReason) {
  this.status = 'refunded';
  this.refundAmount = refundAmount;
  this.refundReason = refundReason;
  return this.save();
};

// 스태틱 메서드: 사용자별 총 결제 금액 조회
paymentSchema.statics.getTotalPaymentsByUser = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
