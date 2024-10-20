import mongoose from 'mongoose';
import Payment from '../../src/models/Payment';

describe('Payment Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create & save payment successfully', async () => {
    const validPayment = new Payment({
      userId: new mongoose.Types.ObjectId(),
      membershipId: new mongoose.Types.ObjectId(),
      amount: 10000,
      paymentMethod: 'card',
      orderId: 'TEST-ORDER-ID',
      status: 'pending'
    });
    const savedPayment = await validPayment.save();
    
    expect(savedPayment._id).toBeDefined();
    expect(savedPayment.status).toBe('pending');
  });

  it('should fail to save payment with negative amount', async () => {
    const paymentWithNegativeAmount = new Payment({
      userId: new mongoose.Types.ObjectId(),
      amount: -100,
      currency: 'USD',
      paymentMethod: 'credit_card',
      status: 'completed',
    });

    let err;
    try {
      await paymentWithNegativeAmount.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save payment with invalid status', async () => {
    const paymentWithInvalidStatus = new Payment({
      userId: new mongoose.Types.ObjectId(),
      amount: 100,
      currency: 'USD',
      paymentMethod: 'credit_card',
      status: 'invalid_status',
    });

    let err;
    try {
      await paymentWithInvalidStatus.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // 추가 테스트 케이스...
});
