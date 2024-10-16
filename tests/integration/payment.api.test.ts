import request from 'supertest';
import app from '../../src/app';
import { setupTestDatabase, closeTestDatabase, generateTestToken } from '../setup';

describe('Payments API', () => {
  let db: any;
  let testToken: string;

  beforeAll(async () => {
    db = await setupTestDatabase();
    testToken = generateTestToken();
  });

  afterAll(async () => {
    await closeTestDatabase(db);
  });

  it('should create a new payment', async () => {
    const res = await request(app)
      .post('/api/payments/create')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        amount: 100,
        paymentMethod: 'credit_card'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('paymentId');
  });

  // 다른 테스트 케이스들...

  it('should do something with authentication', async () => {
    const res = await request(app)
      .get('/api/payments/history')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
  });

  // ... 기타 테스트 ...
});
