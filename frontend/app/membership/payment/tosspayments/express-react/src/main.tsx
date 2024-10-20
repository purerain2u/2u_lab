import React from 'react';  // React import 추가
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { BrandpayCheckoutPage } from "./pages/brandpay/BrandpayCheckout";
import { FailPage } from "./pages/Fail";
import { PaymentBillingPage } from "./pages/payment/PaymentBilling";
import { PaymentCheckout } from "./pages/payment/PaymentCheckout";
import { PaymentSuccessPage } from "./pages/payment/PaymentSuccess";
import { BrandpaySuccessPage } from "./pages/brandpay/BrandpaySuccess";
import { WidgetCheckoutPage } from "./pages/widget/WidgetCheckout";
import { WidgetSuccessPage } from "./pages/widget/WidgetSuccess";

// 멤버십 타입과 가격을 매핑하는 객체
const membershipPrices = {
  Free: 0,
  Bronze: 29900,
  Silver: 59900,
  Gold: 209800,
  Diamond: 359800
};

// PaymentCheckout에 전달할 props를 정의하는 함수
const getPaymentCheckoutProps = (membershipType: keyof typeof membershipPrices) => ({
  membershipType,
  price: membershipPrices[membershipType]
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <WidgetCheckoutPage />,
  },
  {
    path: "widget",
    children: [
      {
        path: "checkout",
        element: <WidgetCheckoutPage />,
      },
      {
        path: "success",
        element: <WidgetSuccessPage />,
      },
    ],
  },
  {
    path: "checkout",
    element: <WidgetCheckoutPage />,
  },
  {
    path: "brandpay",
    children: [
      {
        path: "checkout",
        element: <BrandpayCheckoutPage />,
      },
      {
        path: "success",
        element: <BrandpaySuccessPage />,
      },
    ],
  },
  {
    path: "payment",
    children: [
      {
        path: "checkout/:membershipType",
        element: <PaymentCheckout {...getPaymentCheckoutProps("Bronze")} />, // 기본값으로 Bronze 설정
        loader: ({ params }) => {
          const membershipType = params.membershipType as keyof typeof membershipPrices;
          return getPaymentCheckoutProps(membershipType);
        },
      },
      {
        path: "billing",
        element: <PaymentBillingPage />,
      },
      {
        path: "success",
        element: <PaymentSuccessPage />,
      },
    ],
  },
  {
    path: "fail",
    element: <FailPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
