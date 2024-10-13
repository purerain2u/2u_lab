declare module '@tosspayments/payment-sdk' {
  export function loadTossPayments(clientKey: string): Promise<TossPayments>;
  
  interface TossPayments {
    requestPayment(
      method: string,
      options: {
        amount: number;
        orderId: string;
        orderName: string;
        customerName: string;
        successUrl: string;
        failUrl: string;
      }
    ): Promise<void>;
  }
}
