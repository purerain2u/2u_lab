import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Image from 'next/image';

export function FailPage() {
  const [searchParams] = useSearchParams();

  const errorMessage = searchParams.get("message") || "알 수 없는 오류가 발생했습니다.";
  const errorCode = searchParams.get("code") || "UNKNOWN";

  return (
    <div id="info" className="box_section" style={{ width: "600px" }}>
      <Image src="/path-to-image.png" alt="Description" width={500} height={300} />
      <h2>결제에 실패했어요</h2>

      <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
        <div className="p-grid-col text--left">
          <b>에러메시지</b>
        </div>
        <div className="p-grid-col text--right" id="message">
          {errorMessage}
        </div>
      </div>
      <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
        <div className="p-grid-col text--left">
          <b>에러코드</b>
        </div>
        <div className="p-grid-col text--right" id="code">
          {errorCode}
        </div>
      </div>

      <div className="p-grid-col">
        <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
          <button className="button p-grid-col5">연동 문서</button>
        </Link>
        <Link to="https://discord.gg/A4fRFXQhRu">
          <button 
            className="button p-grid-col5" 
            style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
          >
            실시간 문의
          </button>
        </Link>
      </div>
    </div>
  );
}