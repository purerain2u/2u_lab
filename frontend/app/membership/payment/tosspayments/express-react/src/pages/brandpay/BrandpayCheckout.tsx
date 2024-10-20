import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

export function BrandpayCheckoutPage() {
  const [tossPayments, setTossPayments] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initTossPayments() {
      try {
        const payments = await loadTossPayments(clientKey);
        setTossPayments(payments);
      } catch (err) {
        console.error("Error initializing TossPayments:", err);
        setError("결제 시스템 초기화에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    }

    initTossPayments();
  }, []);

  async function requestPayment() {
    if (!tossPayments) {
      setError("결제 시스템이 초기화되지 않았습니다. 페이지를 새로고침 해주세요.");
      return;
    }

    try {
      await tossPayments.requestPayment("카드", {
        amount: 15000,
        orderId: "sample-" + (Math.random() * 1000000).toFixed(0),
        orderName: "토스 티셔츠 외 2건",
        customerName: "김토스",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (err) {
      console.error("Payment request failed:", err);
      setError("결제 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <div className="wrapper">
      <div className="box_section">
        <h2>브랜드페이 결제</h2>
        {error && <p className="error">{error}</p>}
        <button className="button" onClick={requestPayment}>
          결제하기
        </button>
      </div>
    </div>
  );
}
