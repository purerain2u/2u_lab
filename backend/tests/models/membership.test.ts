import mongoose, { Document } from 'mongoose';
import Membership from '../../server/models/Membership';

// Membership 인터페이스 수정
interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  startDate: Date;
  endDate: Date;
  date: Date;
  hourlyData: mongoose.Types.DocumentArray<{
    hour?: number | null;
    visitors?: number | null;
    applicationsStarted?: number | null;
    applicationsCompleted?: number | null;
  }>;
  membershipTypes?: { [key: string]: any } | null;
  createdAt: Date;
  updatedAt: Date;
}

describe('Membership Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create & save membership successfully', async () => {
    const membershipData = {
      userId: new mongoose.Types.ObjectId(),
      type: 'premium',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // 30일 후
      date: new Date(),
      hourlyData: [],
      membershipTypes: null
    };
    const validMembership = new Membership(membershipData);
    const savedMembership = await validMembership.save() as unknown as IMembership;
    
    expect(savedMembership._id).toBeDefined();
    expect(savedMembership.type).toBe(membershipData.type);
    expect(savedMembership.startDate).toEqual(membershipData.startDate);
    expect(savedMembership.endDate).toEqual(membershipData.endDate);
  });

  it('should fail to save membership with invalid type', async () => {
    const membershipWithInvalidType = new Membership({
      userId: new mongoose.Types.ObjectId(),
      type: 'invalid_type',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    let err;
    try {
      await membershipWithInvalidType.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save membership with end date before start date', async () => {
    const membershipWithInvalidDates = new Membership({
      userId: new mongoose.Types.ObjectId(),
      type: 'premium',
      startDate: new Date(),
      endDate: new Date(Date.now() - 24 * 60 * 60 * 1000),  // 1일 전
    });

    let err;
    try {
      await membershipWithInvalidDates.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // 추가 테스트 케이스...
});
