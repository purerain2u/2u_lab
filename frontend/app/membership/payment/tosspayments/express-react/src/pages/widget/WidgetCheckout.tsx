import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

export function WidgetCheckoutPage() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 50000,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgetsInstance = tossPayments.createPaymentWidget(customerKey);
        setWidgets(widgetsInstance);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      await widgets.updateAmount(amount.value);

      await Promise.all([
        widgets.renderPaymentMethods("#payment-method", { variantKey: "DEFAULT" }),
        widgets.renderAgreement("#agreement", { variantKey: "AGREEMENT" }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, amount]);

  const handleCouponChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!widgets) return;
    const newAmount = event.target.checked ? amount.value - 5000 : amount.value;
    await widgets.updateAmount(newAmount);
    setAmount(prev => ({ ...prev, value: newAmount }));
  };

  const handlePaymentRequest = async () => {
    try {
      await widgets.requestPayment({
        orderId: generateRandomString(),
        orderName: "토스 티셔츠 외 2건",
        successUrl: window.location.origin + "/widget/success",
        failUrl: window.location.origin + "/fail",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
        customerMobilePhone: "01012341234",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-method" />
        <div id="agreement" />
        <div style={{ paddingLeft: "30px" }}>
          <div className="checkable typography--p">
            <label htmlFor="coupon-box" className="checkable__label typography--regular">
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                onChange={handleCouponChange}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>

        <button
          className="button"
          style={{ marginTop: "30px" }}
          disabled={!ready}
          onClick={handlePaymentRequest}
        >
          결제하기
        </button>
      </div>
      <div
        className="box_section"
        style={{
          padding: "40px 30px 50px 30px",
          marginTop: "30px",
          marginBottom: "50px",
        }}
      >
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={() => navigate("/brandpay/checkout")}
        >
          위젯 없이 브랜드페이만 연동하기
        </button>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={() => navigate("/payment/checkout")}
        >
          위젯 없이 결제창만 연동하기
        </button>
      </div>
    </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}