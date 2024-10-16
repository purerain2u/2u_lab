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

  it('should get payment history', async () => {
    const res = await request(app)
      .get('/api/payments/history')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should fail to create payment with invalid amount', async () => {
    const res = await request(app)
      .post('/api/payments/create')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        amount: -100,
        paymentMethod: 'credit_card'
      });

    expect(res.statusCode).toEqual(400);
  });

  it('should fail to access payments without authentication', async () => {
    const res = await request(app)
      .get('/api/payments/history');

    expect(res.statusCode).toEqual(401);
  });
});
