import { Request, Response } from 'express';
import { 
  createPayment, 
  confirmPayment, 
  handlePaymentSuccess, 
  handlePaymentFail,
  getPaymentStatus
} from '../../../src/controllers/paymentController';
import { TossPaymentsService } from '../../../src/services/tossPaymentsService';
import { AppError } from '../../../src/utils/errorClasses';
import logger from '../../../src/utils/logger';

jest.mock('../../../src/services/tossPaymentsService');
jest.mock('../../../src/utils/logger');

describe('Payment Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('createPaymentRequest', () => {
    it('should create a payment request', async () => {
      const mockPaymentRequest = {
        paymentKey: 'test_payment_key',
        orderId: 'test_order_id',
        amount: 10000
      };

      jest.spyOn(TossPaymentsService.prototype, 'createPaymentRequest').mockResolvedValue(mockPaymentRequest);

      mockRequest.body = { amount: 10000, orderId: 'test_order_id' };

      await createPayment(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockPaymentRequest
      });
    });

    it('should handle errors during payment request creation', async () => {
      const error = new Error('Payment request creation failed');
      jest.spyOn(TossPaymentsService.prototype, 'createPaymentRequest').mockRejectedValue(error);

      mockRequest.body = { amount: 10000, orderId: 'test_order_id' };

      await createPayment(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(logger.error).toHaveBeenCalledWith('결제 요청 생성 중 오류:', error);
    });
  });

  describe('handlePaymentSuccess', () => {
    it('should handle successful payment', async () => {
      const mockPaymentResult = {
        status: 'DONE',
        paymentKey: 'test_payment_key',
        orderId: 'test_order_id',
        amount: 10000
      };

      jest.spyOn(TossPaymentsService.prototype, 'confirmPayment').mockResolvedValue(mockPaymentResult);

      mockRequest.body = { paymentKey: 'test_payment_key', orderId: 'test_order_id', amount: 10000 };

      await handlePaymentSuccess(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockPaymentResult
      });
    });

    it('should handle payment confirmation failure', async () => {
      const error = new Error('Payment confirmation failed');
      jest.spyOn(TossPaymentsService.prototype, 'confirmPayment').mockRejectedValue(error);

      mockRequest.body = { paymentKey: 'test_payment_key', orderId: 'test_order_id', amount: 10000 };

      await handlePaymentSuccess(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(logger.error).toHaveBeenCalledWith('결제 확인 중 오류:', error);
    });
  });

  describe('handlePaymentFail', () => {
    it('should handle failed payment', async () => {
      const mockPaymentResult = {
        status: 'FAILED',
        paymentKey: 'test_payment_key',
        orderId: 'test_order_id',
        amount: 10000
      };

      jest.spyOn(TossPaymentsService.prototype, 'confirmPayment').mockResolvedValue(mockPaymentResult);

      mockRequest.body = { paymentKey: 'test_payment_key', orderId: 'test_order_id', amount: 10000 };

      await handlePaymentFail(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockPaymentResult
      });
    });

    it('should handle payment confirmation failure', async () => {
      const error = new Error('Payment confirmation failed');
      jest.spyOn(TossPaymentsService.prototype, 'confirmPayment').mockRejectedValue(error);

      mockRequest.body = { paymentKey: 'test_payment_key', orderId: 'test_order_id', amount: 10000 };

      await handlePaymentFail(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(logger.error).toHaveBeenCalledWith('결제 확인 중 오류:', error);
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status', async () => {
      const mockPaymentStatus = {
        status: 'DONE',
        paymentKey: 'test_payment_key',
        orderId: 'test_order_id',
        amount: 10000
      };

      jest.spyOn(TossPaymentsService.prototype, 'getPaymentStatus').mockResolvedValue(mockPaymentStatus);

      mockRequest.params = { paymentKey: 'test_payment_key' };

      await getPaymentStatus(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockPaymentStatus
      });
    });

    it('should handle errors when getting payment status', async () => {
      const error = new Error('Failed to get payment status');
      jest.spyOn(TossPaymentsService.prototype, 'getPaymentStatus').mockRejectedValue(error);

      mockRequest.params = { paymentKey: 'test_payment_key' };

      await getPaymentStatus(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(logger.error).toHaveBeenCalledWith('결제 상태 조회 중 오류:', error);
    });
  });
});
