import { NextRequest, NextResponse } from 'next/server';
import request from 'supertest';
import app from '../../src/app';  // 경로 수정
import { setupTestDatabase, closeTestDatabase, generateTestToken } from '../setup';

describe('Auth API', () => {
  let db: any;
  let testToken: string;

  beforeAll(async () => {
    db = await setupTestDatabase();
    testToken = generateTestToken();
  });

  afterAll(async () => {
    await closeTestDatabase(db);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'newuser@example.com',
        password: 'newPassword123!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', '회원가입이 완료되었습니다');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // Next.js specific tests (you may need to adjust these based on your actual implementation)
  it('should handle Next.js API routes', async () => {
    const mockNextRequest = (body: any): NextRequest => {
      return {
        json: () => Promise.resolve(body)
      } as unknown as NextRequest;
    };

    const loginRequest = mockNextRequest({ email: 'test@example.com', password: 'password123' });
    const loginResponse = await login(loginRequest);
    expect(loginResponse).toBeInstanceOf(NextResponse);
    const loginResponseBody = await (loginResponse as NextResponse).json();
    expect(loginResponseBody).toHaveProperty('token');

    const registerRequest = mockNextRequest({ 
      username: 'testuser', 
      email: 'newuser@example.com', 
      password: 'newPassword123!' 
    });
    const registerResponse = await register(registerRequest);
    expect(registerResponse).toBeInstanceOf(NextResponse);
    const registerResponseBody = await (registerResponse as NextResponse).json();
    expect(registerResponseBody).toHaveProperty('message', '회원가입이 완료되었습니다');
  });

  it('should do something with authentication', async () => {
    const res = await request(app)
      .get('/api/auth/protected')  // 실제 존재하는 보호된 엔드포인트로 변경
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
  });

  // 추가 테스트 케이스...
});
