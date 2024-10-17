import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Image from 'next/image';

export function PaymentBillingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const [billingConfirmed, setBillingConfirmed] = useState(false);

  useEffect(() => {
    // 서버에 빌링키 발급을 위해 authKey 를 보냅니다.
    // @docs https://docs.tosspayments.com/reference#authkey로-카드-빌링키-발급
    async function issueBillingKey() {
      const requestData = {
        customerKey: searchParams.get("customerKey"),
        authKey: searchParams.get("authKey"),
      };

      const response = await fetch("/api/issue-billing-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }

    issueBillingKey()
      .then(function (data) {
        // TODO: 빌링키 발급이 성공했을 경우 UI 처리 로직을 구현하세요.
        setResponseData(data);
      })
      .catch((err) => {
        // TODO: 빌링키 발급이 실패했을 경우 UI 처리 로직을 구현하세요.
        navigate(`/fail?message=${err.message}&code=${err.code}`);
      });
  }, [navigate, searchParams]);

  // 일반적으로 자동결제는 특정 시점에 배치로 실행됩니다.
  // 테스트를 위해 여기 클라이언트에서 강제로 실행해볼 수 있도록 샘플 API 가 구현되어 있습니다.
  async function confirm() {
    async function confirmBilling() {
      const requestData = {
        customerKey: searchParams.get("customerKey"),
        amount: 4900,
        orderId: generateRandomString(),
        orderName: "토스 프라임 구독",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
      };

      const response = await fetch("/api/confirm-billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }

    confirmBilling()
      .then(function (data) {
        setBillingConfirmed(true);
        setResponseData(data);
      })
      .catch((err) => {
        navigate(`/fail?message=${err.message}&code=${err.code}`);
      });
  }

  return (
    <div className="wrapper">
      <div className="box_section" style={{ width: "600px" }}>
        <Image src="/path-to-image.png" alt="Description" width={500} height={300} />
        <h2 id="title">{billingConfirmed ? "빌링키로 결제가 성공했어요" : "빌링키 발급이 완료되었어요"}</h2>

        {billingConfirmed === false ? (
          <button id="confirm" className="button" onClick={confirm}>
            강제로 자동결제 실행시키기
          </button>
        ) : null}

        <div className="p-grid" style={{ marginTop: "30px" }}>
          <button
            className="button p-grid-col5"
            onClick={() => {
              location.href = "https://docs.tosspayments.com/guides/v2/billing/integration";
            }}
          >
            연동 문서
          </button>
          <button
            className="button p-grid-col5"
            onClick={() => {
              location.href = "https://discord.gg/A4fRFXQhRu";
            }}
            style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
          >
            실시간 문의
          </button>
        </div>
        <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
          <b>Response Data :</b>
          <div id="response" style={{ whiteSpace: "initial" }}>
            {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}