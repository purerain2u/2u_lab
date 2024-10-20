import mongoose from 'mongoose';
import User from '../../server/models/User';

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create & save user successfully', async () => {
    const validUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123'
    });

    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // 추가 테스트 케이스...
});
