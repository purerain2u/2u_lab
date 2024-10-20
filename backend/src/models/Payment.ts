import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  membershipId: mongoose.Types.ObjectId;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentKey?: string;
  transactionId?: string;
  paymentDetails?: any;
  cancelDetails?: any;
  refundAmount?: number;
  refundReason?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  completePayment(paymentKey: string, transactionId: string, paymentDetails: any): Promise<IPayment>;
  cancelPayment(cancelDetails: any): Promise<IPayment>;
  refundPayment(refundAmount: number, refundReason: string): Promise<IPayment>;
}

interface IPaymentModel extends Model<IPayment> {
  getTotalPaymentsByUser(userId: string): Promise<{ _id: null; total: number }[]>;
}

const paymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  membershipId: {
    type: Schema.Types.ObjectId,
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
  paymentDetails: Schema.Types.Mixed,
  cancelDetails: Schema.Types.Mixed,
  refundAmount: Number,
  refundReason: String,
  metadata: Schema.Types.Mixed
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

paymentSchema.index({ orderId: 1, paymentKey: 1 });

paymentSchema.virtual('hoursSincePayment').get(function(this: IPayment) {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

paymentSchema.methods.completePayment = function(paymentKey: string, transactionId: string, paymentDetails: any): Promise<IPayment> {
  this.status = 'completed';
  this.paymentKey = paymentKey;
  this.transactionId = transactionId;
  this.paymentDetails = paymentDetails;
  return this.save();
};

paymentSchema.methods.cancelPayment = function(cancelDetails: any): Promise<IPayment> {
  this.status = 'cancelled';
  this.cancelDetails = cancelDetails;
  return this.save();
};

paymentSchema.methods.refundPayment = function(refundAmount: number, refundReason: string): Promise<IPayment> {
  this.status = 'refunded';
  this.refundAmount = refundAmount;
  this.refundReason = refundReason;
  return this.save();
};

paymentSchema.static('getTotalPaymentsByUser', function(userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
});

const Payment = mongoose.model<IPayment, IPaymentModel>('Payment', paymentSchema);

export default Payment;
