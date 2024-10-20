import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = generateRandomString();

type PaymentMethodType = "카드" | "계좌이체" | "가상계좌" | "휴대폰" | "문화상품권" | "토스페이";

export interface PaymentCheckoutProps {
  membershipType: string;
  price: number;
}

export function PaymentCheckout({ membershipType, price }: PaymentCheckoutProps) {
  const [tossPayments, setTossPayments] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initTossPayments() {
      try {
        const payments = await loadTossPayments(clientKey);
        setTossPayments(payments);
      } catch (error) {
        console.error("Error initializing TossPayments:", error);
        setError("결제 시스템 초기화에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    }

    initTossPayments();
  }, []);

  function selectPaymentMethod(method: PaymentMethodType) {
    setSelectedPaymentMethod(method);
    setError(null);
  }

  async function requestPayment() {
    if (!tossPayments || !selectedPaymentMethod) {
      setError("결제 수단을 선택해주세요.");
      return;
    }

    const paymentData = {
      amount: price,
      orderId: generateRandomString(),
      orderName: `${membershipType} 멤버십`,
      customerName: "김토스",
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/fail`,
      customerEmail: "customer123@gmail.com",
      customerMobilePhone: "01012341234",
    };

    try {
      switch (selectedPaymentMethod) {
        case "카드":
          await tossPayments.requestPayment("카드", paymentData);
          break;
        case "계좌이체":
          await tossPayments.requestPayment("계좌이체", paymentData);
          break;
        case "가상계좌":
          await tossPayments.requestPayment("가상계좌", {...paymentData, validHours: 24, cashReceipt: {type: '소득공제'}});
          break;
        case "휴대폰":
          await tossPayments.requestPayment("휴대폰", paymentData);
          break;
        case "문화상품권":
          await tossPayments.requestPayment("문화상품권", paymentData);
          break;
        case "토스페이":
          await tossPayments.requestPayment("토스페이", paymentData);
          break;
        default:
          throw new Error("지정하지 않은 결제 수단을 선택했습니다.");
      }
    } catch (error) {
      console.error("Payment request failed:", error);
      setError("결제 요청 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  async function requestBillingAuth() {
    if (!tossPayments) {
      setError("결제 시스템이 초기화되지 않았습니다. 페이지를 새로고침 해주세요.");
      return;
    }

    try {
      await tossPayments.requestBillingAuth({
        customerKey,
        successUrl: `${window.location.origin}/payment/billing`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
      });
    } catch (error) {
      console.error("Billing auth request failed:", error);
      setError("빌링키 발급 요청 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <div className="wrapper">
      <div className="box_section">
        <h1>{membershipType} 멤버십 결제 (가격 {price}원)</h1>
        <div id="payment-method" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
          {["카드", "계좌이체", "가상계좌", "휴대폰", "문화상품권", "토스페이"].map((method) => (
            <button
              key={method}
              id={method}
              className={`button2 ${selectedPaymentMethod === method ? "active" : ""}`}
              onClick={() => selectPaymentMethod(method as PaymentMethodType)}
            >
              {method}
            </button>
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="button" onClick={requestPayment} disabled={!selectedPaymentMethod}>
          결제하기
        </button>
      </div>
      <div className="box_section">
        <h1>정기 결제</h1>
        <button className="button" onClick={requestBillingAuth}>
          빌링키 발급하기
        </button>
      </div>
    </div>
  );
}

function generateRandomString(): string {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
