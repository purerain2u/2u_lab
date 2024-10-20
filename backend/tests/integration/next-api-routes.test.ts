import { NextApiRequest, NextApiResponse } from 'next';
import httpMocks from 'node-mocks-http';
import { POST as register } from '../../app/api/auth/register/route';
import { POST as login } from '../../app/api/login/route';

describe('Next.js API Routes', () => {
  it('should handle registration', async () => {
    const { req, res } = httpMocks.createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    });

    await register(req);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toHaveProperty('message', '회원가입이 완료되었습니다');
  });

  it('should handle login', async () => {
    const { req, res } = httpMocks.createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    });

    await login(req);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('token');
  });
});
