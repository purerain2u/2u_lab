const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(express.json());

// TODO: 실제 운영 환경에서는 환경 변수를 사용하여 시크릿 키를 관리하세요.
const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
const apiSecretKey = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";

const encryptedWidgetSecretKey = Buffer.from(widgetSecretKey + ":").toString("base64");
const encryptedApiSecretKey = Buffer.from(apiSecretKey + ":").toString("base64");

async function confirmPayment(paymentKey, orderId, amount, secretKey) {
  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || "결제 승인 실패");
  }

  return result;
}

app.post("/confirm/widget", async (req, res) => {
  try {
    const result = await confirmPayment(req.body.paymentKey, req.body.orderId, req.body.amount, encryptedWidgetSecretKey);
    res.json(result);
  } catch (error) {
    console.error("위젯 결제 승인 오류:", error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/confirm/payment", async (req, res) => {
  try {
    const result = await confirmPayment(req.body.paymentKey, req.body.orderId, req.body.amount, encryptedApiSecretKey);
    res.json(result);
  } catch (error) {
    console.error("결제창 승인 오류:", error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/confirm/brandpay", async (req, res) => {
  try {
    const { paymentKey, orderId, amount, customerKey } = req.body;
    const response = await fetch("https://api.tosspayments.com/v1/brandpay/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedApiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount, customerKey }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "브랜드페이 승인 실패");

    res.json(result);
  } catch (error) {
    console.error("브랜드페이 승인 오류:", error);
    res.status(400).json({ message: error.message });
  }
});

app.get("/callback-auth", async (req, res) => {
  try {
    const { customerKey, code } = req.query;
    const response = await fetch("https://api.tosspayments.com/v1/brandpay/authorizations/access-token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedApiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grantType: "AuthorizationCode", customerKey, code }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Access Token 발급 실패");

    res.json(result);
  } catch (error) {
    console.error("Access Token 발급 오류:", error);
    res.status(400).json({ message: error.message });
  }
});

const billingKeyMap = new Map();

app.post("/issue-billing-key", async (req, res) => {
  try {
    const { customerKey, authKey } = req.body;
    const response = await fetch("https://api.tosspayments.com/v1/billing/authorizations/issue", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedApiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerKey, authKey }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "빌링키 발급 실패");

    billingKeyMap.set(customerKey, result.billingKey);
    res.json(result);
  } catch (error) {
    console.error("빌링키 발급 오류:", error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/confirm-billing", async (req, res) => {
  try {
    const { customerKey, amount, orderId, orderName, customerEmail, customerName } = req.body;
    const billingKey = billingKeyMap.get(customerKey);
    if (!billingKey) throw new Error("빌링키를 찾을 수 없습니다.");

    const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedApiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerKey, amount, orderId, orderName, customerEmail, customerName }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "자동결제 승인 실패");

    res.json(result);
  } catch (error) {
    console.error("자동결제 승인 오류:", error);
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => console.log(`http://localhost:${port} 으로 샘플 앱이 실행되었습니다.`));