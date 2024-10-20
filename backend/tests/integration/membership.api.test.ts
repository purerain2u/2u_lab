import request from 'supertest';
import app from '../../src/app';  // 경로 수정
import { setupTestDatabase, closeTestDatabase, generateTestToken } from '../setup';

describe('Membership API', () => {
  let db: any;
  let testToken: string;

  beforeAll(async () => {
    db = await setupTestDatabase();
    testToken = generateTestToken();
  });

  afterAll(async () => {
    await closeTestDatabase(db);
  });

  it('should create a new membership', async () => {
    const res = await request(app)
      .post('/api/memberships/create')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        type: 'premium',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('membershipId');
  });

  it('should get current membership', async () => {
    const res = await request(app)
      .get('/api/memberships/current')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('type');
    expect(res.body).toHaveProperty('endDate');
  });

  // 다른 테스트 케이스들...
});
