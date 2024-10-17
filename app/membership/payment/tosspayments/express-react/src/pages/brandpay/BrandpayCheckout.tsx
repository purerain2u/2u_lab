import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

// ------  SDK 초기화------
// TODO: clientKey를 개발자센터의 API 개별 연동 시 > 연동할 상용 브랜드페이를 계약한 MID > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 시의 키가 아닌 API 개별 연동 시의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 식별자를 불러와서 customerKey로 지정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = generateRandomString();

export function BrandpayCheckoutPage() {
  const [tossPayments, setTossPayments] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initTossPayments() {
      try {
        const payments = await loadTossPayments(clientKey);
        setTossPayments(payments);
      } catch (error) {
        console.error("Error initializing TossPayments:", error);
        setError("결제 시스템 초기화에 실패했습니다.");
      }
    }

    initTossPayments();
  }, []);

  const handlePayment = async () => {
    if (!tossPayments) {
      setError("결제 시스템이 초기화되지 않았습니다.");
      return;
    }

    try {
      await tossPayments.requestPayment("카드", {
        // 결제 요청 데이터...
      });
    } catch (error) {
      console.error("Payment request failed:", error);
      setError("결제 요청 중 오류가 발생했습니다.");
    }
  };

  // ------ '결제하기' 버튼 누르면 결제창 띄우기------
  // @docs https://docs.tosspayments.com/sdk/v2/js#brandpayrequestpayment
  async function requestPayment() {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인할 수 있도록 합니다.
    await tossPayments.requestPayment({
      amount: {
        currency: "KRW",
        value: 50000,
      },
      orderId: generateRandomString(), // 고유 주문번호
      orderName: "토스 티셔츠 외 2건",
      successUrl: window.location.origin + `/brandpay/success?customerKey=${customerKey}&`, // 결제 요청이 성공하면 리다이렉트되는 URL
      failUrl: window.location.origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
    });
  }

  async function addPaymentMethod() {
    await tossPayments.addPaymentMethod();
  }

  async function changeOneTouchPay() {
    await tossPayments.changeOneTouchPay();
  }

  async function changePassword() {
    await tossPayments.changePassword();
  }

  async function isOneTouchPayEnabled() {
    const result = await tossPayments.isOneTouchPayEnabled();

    alert(result);
  }

  async function openSettings() {
    await tossPayments.openSettings();
  }

  return (
    <div className="wrapper">
      <div
        className="box_section"
        style={{
          padding: "40px 30px 50px 30px",
          marginTop: "30px",
          marginBottom: "50px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button className="button" style={{ marginTop: "30px" }} onClick={handlePayment}>
          결제하기
        </button>
        <button className="button" style={{ marginTop: "30px" }} onClick={addPaymentMethod}>
          결제수단추가
        </button>
        <button className="button" style={{ marginTop: "30px" }} onClick={changeOneTouchPay}>
          원터치페이설정변경
        </button>
        <button className="button" style={{ marginTop: "30px" }} onClick={changePassword}>
          비밀번호변경
        </button>
        <button className="button" style={{ marginTop: "30px" }} onClick={isOneTouchPayEnabled}>
          원터치결제사용여부 조회
        </button>
        <button className="button" style={{ marginTop: "30px" }} onClick={openSettings}>
          브랜드페이 설정 열기
        </button>
      </div>
    </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
