import request from 'supertest';
import app from '../../src/app';

describe('Express API 라우트', () => {
  
  describe('멤버십 API', () => {
    it('GET /api/membership 요청에 성공적으로 응답해야 합니다', async () => {
      const response = await request(app).get('/api/membership');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('멤버십 정보를 가져왔습니다.');
    });

    it('존재하지 않는 멤버십 ID로 요청 시 404를 반환해야 합니다', async () => {
      const response = await request(app).get('/api/membership/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '멤버십을 찾을 수 없습니다.');
    });
  });

  describe('결제 API', () => {
    it('POST /api/payments 요청에 성공적으로 응답해야 합니다', async () => {
      const paymentData = {
        amount: 1000,
        currency: 'KRW',
        paymentMethod: 'card'
      };

      const response = await request(app)
        .post('/api/payments')
        .send(paymentData);
    
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', '결제가 성공적으로 처리되었습니다.');
    });

    it('잘못된 결제 데이터로 요청 시 400을 반환해야 합니다', async () => {
      const invalidPaymentData = {
        amount: -1000,  // 잘못된 금액
        currency: 'INVALID',
      };

      const response = await request(app)
        .post('/api/payments')
        .send(invalidPaymentData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', '잘못된 결제 정보입니다.');
    });
  });

  // 추가적인 API 테스트를 여기에 작성할 수 있습니다.
});
