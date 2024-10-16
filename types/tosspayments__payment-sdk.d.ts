declare module '@tosspayments/payment-sdk' {
  export function loadTossPayments(clientKey: string): Promise<TossPayments>;
  
  interface TossPayments {
    widgets(options: { customerKey: string }): TossWidgets;
    requestPayment(method: string, options: PaymentOptions): Promise<PaymentResponse>;
    brandpay(options: { customerKey: string, redirectUrl: string }): BrandPay;
  }

  interface PaymentOptions {
    amount: number;
    orderId: string;
    orderName: string;
    customerName: string;
    successUrl: string;
    failUrl: string;
    [key: string]: any;
  }

  interface PaymentResponse {
    paymentKey: string;
    orderId: string;
    amount: number;
    status: string;
    // 필요에 따라 더 많은 필드를 추가할 수 있습니다.
  }

  interface TossWidgets {
    setAmount(amount: Amount): Promise<void>;
    renderPaymentMethods(options: PaymentMethodOptions): Promise<void>;
    renderAgreement(options: AgreementOptions): Promise<void>;
    requestPayment(options: WidgetPaymentOptions): Promise<PaymentResponse>;
  }

  interface PaymentMethodOptions {
    selector: string;
    // 필요에 따라 더 많은 옵션을 추가할 수 있습니다.
  }

  interface AgreementOptions {
    selector: string;
    // 필요에 따라 더 많은 옵션을 추가할 수 있습니다.
  }

  interface WidgetPaymentOptions {
    orderId: string;
    orderName: string;
    customerName: string;
    customerEmail?: string;
    successUrl: string;
    failUrl: string;
    // 필요에 따라 더 많은 옵션을 추가할 수 있습니다.
  }

  interface BrandPay {
    requestPayment(options: BrandPayOptions): Promise<PaymentResponse>;
    addPaymentMethod(): Promise<void>;
    changeOneTouchPay(): Promise<void>;
    changePassword(): Promise<void>;
    isOneTouchPayEnabled(): Promise<boolean>;
    openSettings(): Promise<void>;
  }

  interface BrandPayOptions extends PaymentOptions {
    customerEmail: string;
  }

  interface Amount {
    currency: string;
    value: number;
  }

  // PaymentWidget 관련 인터페이스는 제거했습니다. loadTossPayments 함수로 대체됩니다.
}
