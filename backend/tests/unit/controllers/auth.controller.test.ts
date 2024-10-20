const { login, register } = require('../../src/controllers/auth.controller');
const User = require('../../src/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../server/app');

jest.mock('../../src/models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('login', () => {
    it('should return a token when credentials are valid', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      User.findOne.mockResolvedValue({ _id: '123', email: 'test@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fakeToken');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        token: 'fakeToken'
      }));
    });

    // 추가 테스트 케이스...
  });

  describe('register', () => {
    it('should create a new user when valid data is provided', async () => {
      const req = {
        body: { username: 'testuser', email: 'test@example.com', password: 'password123' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue({ _id: '123', username: 'testuser', email: 'test@example.com' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '회원가입이 완료되었습니다'
      }));
    });

    // 추가 테스트 케이스...
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', '회원가입이 완료되었습니다.');
  });

  // 추가 테스트 케이스...
});
