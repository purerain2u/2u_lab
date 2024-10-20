import { Request, Response } from 'express';
import { createMembership, updateMembership, getMembership, membershipService } from '../../../src/controllers/membershipController';
import { AppError } from '../../../src/utils/errorClasses';
import logger from '../../../src/utils/logger';

jest.mock('../../../src/models/Membership');
jest.mock('../../../src/utils/logger');

describe('Membership Controller', () => {
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

  describe('createMembership', () => {
    it('should create a new membership', async () => {
      const mockMembership = {
        id: '1',
        userId: '123',
        type: 'basic',
        endDate: new Date(),
      };

      jest.spyOn(membershipService, 'create').mockResolvedValue(mockMembership as any);

      mockRequest.body = { userId: '123', type: 'basic', endDate: new Date() };

      await createMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: { membership: mockMembership }
      });
      expect(logger.info).toHaveBeenCalledWith(`멤버십 생성 완료: ${mockMembership.id}`);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      jest.spyOn(membershipService, 'create').mockRejectedValue(error);

      mockRequest.body = { userId: '123', type: 'basic', endDate: new Date() };

      await createMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(logger.error).toHaveBeenCalledWith('멤버십 생성 중 오류:', error);
    });

    it('should handle invalid input', async () => {
      mockRequest.body = { userId: '123', type: 'invalid_type', endDate: new Date() };

      await createMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('getMembership', () => {
    it('should get an active membership', async () => {
      const mockMembership = {
        id: '1',
        userId: '123',
        type: 'basic',
        isActive: true,
      };

      jest.spyOn(membershipService, 'findOne').mockResolvedValue(mockMembership as any);

      mockRequest.params = { userId: '123' };

      await getMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: { membership: mockMembership }
      });
      expect(logger.info).toHaveBeenCalledWith(`멤버십 조회 완료: ${mockMembership.id}`);
    });

    it('should handle not found error', async () => {
      jest.spyOn(membershipService, 'findOne').mockResolvedValue(null);

      mockRequest.params = { userId: '123' };

      await getMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(logger.warn).toHaveBeenCalledWith(`활성 멤버십 없음: userId 123`);
    });

    it('should handle invalid userId', async () => {
      mockRequest.params = { userId: 'invalid_id' };

      await getMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('updateMembership', () => {
    it('should update an existing membership', async () => {
      const mockMembership = {
        id: '1',
        userId: '123',
        type: 'premium',
        isActive: true,
      };

      jest.spyOn(membershipService, 'findOneAndUpdate').mockResolvedValue(mockMembership as any);

      mockRequest.params = { userId: '123' };
      mockRequest.body = { type: 'premium' };

      await updateMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: { membership: mockMembership }
      });
      expect(logger.info).toHaveBeenCalledWith(`멤버십 업데이트 완료: ${mockMembership.id}`);
    });

    it('should handle not found error', async () => {
      jest.spyOn(membershipService, 'findOneAndUpdate').mockResolvedValue(null);

      mockRequest.params = { userId: '123' };
      mockRequest.body = { type: 'premium' };

      await updateMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(logger.warn).toHaveBeenCalledWith(`업데이트할 활성 멤버십 없음: userId 123`);
    });

    it('should handle invalid update data', async () => {
      mockRequest.params = { userId: '123' };
      mockRequest.body = { type: 'invalid_type' };

      await updateMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should not update with empty body', async () => {
      mockRequest.params = { userId: '123' };
      mockRequest.body = {};

      await updateMembership(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
