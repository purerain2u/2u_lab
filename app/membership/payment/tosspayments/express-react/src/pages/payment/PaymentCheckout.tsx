import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

// SDK 초기화
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = generateRandomString();

type PaymentMethodType = "카드" | "계좌이체" | "가상계좌" | "휴대폰" | "문화상품권" | "토스페이";

interface Amount {
  currency: string;
  value: number;
}

interface PaymentCheckoutProps {
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
    setError(null); // 새로운 결제 수단 선택 시 이전 오류 메시지 초기화
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
          await tossPayments.requestPayment("가상계좌", {...paymentData, validHours: 24, cashReceipt: {type: '?득공제'}});
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
        // ?른 결제 ?단을 추가할 수 있습니다.
        default:
          throw new Error("지정하지 않은 결제 ?단을 선택했습니다.");
      }
    } catch (error) {
      console.error("Payment request failed:", error);
      setError("결제 ?청 ?류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  async function requestBillingAuth() {
    if (!tossPayments) {
      setError("결제 ?스?이 초기화되지 않았습니다. ?이지?로 ?고침 ?주?요.");
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
      setError("빌링?발급 ?청 ?류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <div className="wrapper">
      <div className="box_section">
        <h1>{membershipType} 멤버십 결제 (가? {price}??</h1>
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
          결제?기
        </button>
      </div>
      <div className="box_section">
        <h1>?기 결제</h1>
        <button className="button" onClick={requestBillingAuth}>
          빌링?발급?기
        </button>
      </div>
    </div>
  );
}

function generateRandomString(): string {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
