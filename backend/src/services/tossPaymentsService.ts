import axios, { AxiosError } from 'axios';
import { config } from '../config';
import logger from '../utils/logger';
import { AppError } from '../utils/errorClasses';
import { v4 as uuidv4 } from 'uuid';

const TOSS_API_URL = 'https://api.tosspayments.com/v1';

type PaymentMethod = 'card' | 'transfer' | 'virtualAccount' | 'mobilePhone';

interface PaymentRequestOptions {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
  paymentMethod: PaymentMethod;
  validHours?: number;
  cashReceipt?: {
    type: 'income' | 'expenditure';
  };
  useEscrow?: boolean;
  escrowProducts?: Array<{
    id: string;
    name: string;
    code: string;
    unitPrice: number;
    quantity: number;
  }>;
}

export class TossPaymentsService {
  async confirmPayment(paymentKey: string, orderId: string, amount: number) {
    try {
      logger.info(`Confirming payment: paymentKey=${paymentKey}, orderId=${orderId}, amount=${amount}`);
      const response = await axios.post(
        `${TOSS_API_URL}/payments/${paymentKey}`,
        { orderId, amount },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      logger.info(`Payment confirmed successfully: paymentKey=${paymentKey}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        logger.error(`Payment confirmation failed: paymentKey=${paymentKey}, status=${axiosError.response?.status}, message=${(axiosError.response?.data as any)?.message || 'Unknown error'}`);
        throw new AppError('결제 확인 실패', axiosError.response?.status || 500);
      } else {
        logger.error(`Unexpected error during payment confirmation: paymentKey=${paymentKey}, error=${error}`);
        throw new AppError('예기치 못한 오류 발생', 500);
      }
    }
  }

  async cancelPayment(paymentKey: string, cancelReason: string) {
    try {
      logger.info(`Cancelling payment: paymentKey=${paymentKey}, cancelReason=${cancelReason}`);
      const response = await axios.post(
        `${TOSS_API_URL}/payments/${paymentKey}/cancel`,
        { cancelReason },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      logger.info(`Payment cancelled successfully: paymentKey=${paymentKey}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        logger.error(`Payment cancellation failed: paymentKey=${paymentKey}, status=${axiosError.response?.status}, message=${(axiosError.response?.data as any)?.message || 'Unknown error'}`);
        throw new AppError('결제 취소 실패', axiosError.response?.status || 500);
      } else {
        logger.error(`Unexpected error during payment cancellation: paymentKey=${paymentKey}, error=${error}`);
        throw new AppError('예기치 못한 오류 발생', 500);
      }
    }
  }

  async getPaymentStatus(paymentKey: string) {
    try {
      logger.info(`Fetching payment details: paymentKey=${paymentKey}`);
      const response = await axios.get(
        `${TOSS_API_URL}/payments/${paymentKey}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      logger.info(`Payment details fetched successfully: paymentKey=${paymentKey}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        logger.error(`Fetching payment details failed: paymentKey=${paymentKey}, status=${axiosError.response?.status}, message=${(axiosError.response?.data as any)?.message || 'Unknown error'}`);
        throw new AppError('결제 상세 정보 조회 실패', axiosError.response?.status || 500);
      } else {
        logger.error(`Unexpected error during fetching payment details: paymentKey=${paymentKey}, error=${error}`);
        throw new AppError('예기치 못한 오류 발생', 500);
      }
    }
  }

  async createPaymentRequest(options: PaymentRequestOptions) {
    try {
      logger.info(`Creating payment request: orderId=${options.orderId}, amount=${options.amount}, method=${options.paymentMethod}`);
      
      const requestBody: any = {
        amount: options.amount,
        orderId: options.orderId,
        orderName: options.orderName,
        successUrl: options.successUrl,
        failUrl: options.failUrl,
        customerName: options.customerName,
        method: options.paymentMethod,
      };

      // 결제 방법에 따른 추가 옵션
      switch (options.paymentMethod) {
        case 'virtualAccount':
          requestBody.validHours = options.validHours || 24;
          if (options.cashReceipt) {
            requestBody.cashReceipt = options.cashReceipt;
          }
          break;
        case 'transfer':
          if (options.cashReceipt) {
            requestBody.cashReceipt = options.cashReceipt;
          }
          break;
        case 'card':
          if (options.useEscrow) {
            requestBody.useEscrow = options.useEscrow;
            requestBody.escrowProducts = options.escrowProducts;
          }
          break;
      }

      const response = await axios.post(
        `${TOSS_API_URL}/payments`,
        requestBody,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(config.tossSecretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info(`Payment request created successfully: orderId=${options.orderId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        logger.error(`Payment request creation failed: orderId=${options.orderId}, status=${axiosError.response?.status}, message=${(axiosError.response?.data as any)?.message || 'Unknown error'}`);
        throw new AppError('결제 요청 생성 실패', axiosError.response?.status || 500);
      } else {
        logger.error(`Unexpected error during payment request creation: orderId=${options.orderId}, error=${error}`);
        throw new AppError('예기치 못한 오류 발생', 500);
      }
    }
  }
}
