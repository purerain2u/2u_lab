import request from 'supertest';
import app from '../../src/app';
import { setupTestDatabase, closeTestDatabase, generateTestToken } from '../setup';

describe('Auth API', () => {
  let testToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    testToken = generateTestToken();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', '회원가입이 완료되었습니다');
  });

  it('should login a user', async () => {
    // 먼저 사용자를 등록합니다
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should do something with authentication', async () => {
    const res = await request(app)
      .get('/api/auth/protected')  // 실제 존재하는 보호된 엔드포인트로 변경
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(200);
  });

  // 추가 테스트 케이스...
});
