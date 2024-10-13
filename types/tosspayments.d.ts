declare module '@tosspayments/payment-sdk' {
    export function loadTossPayments(clientKey: string): Promise<TossPayments>;
    
    interface TossPayments {
        widgets(options: { customerKey: string }): TossWidgets;
        requestPayment(method: string, options: PaymentOptions): Promise<void>;
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

    interface TossWidgets {
        setAmount(amount: Amount): Promise<void>;
        renderPaymentMethods(options: any): Promise<void>;
        renderAgreement(options: any): Promise<void>;
        requestPayment(options: any): Promise<void>;
    }

    interface BrandPay {
        requestPayment(options: BrandPayOptions): Promise<void>;
        addPaymentMethod(): Promise<void>;
        changeOneTouchPay(): Promise<void>;
        changePassword(): Promise<void>;
        isOneTouchPayEnabled(): Promise<boolean>;
        openSettings(): Promise<void>;
    }

    interface BrandPayOptions {
        amount: {
            currency: string;
            value: number;
        };
        orderId: string;
        orderName: string;
        successUrl: string;
        failUrl: string;
        customerEmail: string;
        customerName: string;
    }

    interface Amount {
        currency: string;
        value: number;
    }
}
