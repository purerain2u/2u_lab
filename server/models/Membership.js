const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['free', 'bronze', 'silver', 'gold', 'diamond'],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: true
  },
  benefits: [{
    type: String
  }],
  usageLimit: {
    type: Map,
    of: Number,
    default: {}
  },
  renewalHistory: [{
    renewalDate: Date,
    previousType: String,
    newType: String
  }],
  cancellationDate: Date,
  cancellationReason: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 가상 필드: 남은 일수
membershipSchema.virtual('daysRemaining').get(function() {
  return Math.ceil((this.endDate - new Date()) / (1000 * 60 * 60 * 24));
});

// 인덱스 생성
membershipSchema.index({ userId: 1, type: 1 });

// 멤버십 갱신 메서드
membershipSchema.methods.renew = function(duration) {
  const oldEndDate = this.endDate;
  this.endDate = new Date(oldEndDate.getTime() + duration * 24 * 60 * 60 * 1000);
  this.renewalHistory.push({
    renewalDate: new Date(),
    previousType: this.type,
    newType: this.type
  });
  return this.save();
};

// 멤버십 업그레이드 메서드
membershipSchema.methods.upgrade = function(newType, price) {
  this.renewalHistory.push({
    renewalDate: new Date(),
    previousType: this.type,
    newType: newType
  });
  this.type = newType;
  this.price = price;
  return this.save();
};

// 멤버십 취소 메서드
membershipSchema.methods.cancel = function(reason) {
  this.isActive = false;
  this.autoRenew = false;
  this.cancellationDate = new Date();
  this.cancellationReason = reason;
  return this.save();
};

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
