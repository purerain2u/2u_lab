import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Image from 'next/image';

type ErrorType = { message: string; code: string };

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function confirmPayment() {
      setIsLoading(true);
      try {
        const requestData = {
          orderId: searchParams.get("orderId"),
          amount: searchParams.get("amount"),
          paymentKey: searchParams.get("paymentKey"),
        };

        const response = await fetch("/api/confirm/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "결제 확인 중 오류가 발생했습니다.");
        }

        const data = await response.json();
        setResponseData(data);
      } catch (error: unknown) {
        console.error("Payment confirmation error:", error);
        const err = error as ErrorType;
        navigate(`/fail?code=${err.code || 'UNKNOWN'}&message=${encodeURIComponent(err.message || '알 수 없는 오류가 발생했습니다.')}`);
      } finally {
        setIsLoading(false);
      }
    }

    confirmPayment();
  }, [searchParams, navigate]);

  if (isLoading) {
    return <div>결제 확인 중...</div>;
  }

  return (
    <>
      <div className="box_section" style={{ width: "600px" }}>
        <Image src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="결제 완료" width={500} height={300} />
        <h2>결제가 완료되었어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount") || 0).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {searchParams.get("orderId")}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
            {searchParams.get("paymentKey")}
          </div>
        </div>
        <div className="p-grid-col">
          <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button className="button p-grid-col5" style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}>
              실시간 문의
            </button>
          </Link>
        </div>
      </div>
      <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
