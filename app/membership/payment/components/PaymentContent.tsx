'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '../PaymentPage.module.css';

declare global {
  interface Window {
    TossPayments?: any;
  }
}

interface PaymentContentProps {
  type: string;
  price: number;
}

const PaymentContent: React.FC<PaymentContentProps> = ({ type, price }) => {
  const [isClient, setIsClient] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('신용카드');
  const [checkboxes, setCheckboxes] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === 'all') {
      setCheckboxes({
        all: checked,
        terms: checked,
        privacy: checked,
        marketing: checked
      });
    } else {
      setCheckboxes(prev => {
        const newState = { ...prev, [name]: checked };
        newState.all = newState.terms && newState.privacy && newState.marketing;
        return newState;
      });
    }
  }, []);

  const isPaymentEnabled = checkboxes.terms && checkboxes.privacy;

  const handlePayment = useCallback(() => {
    if (!isPaymentEnabled) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    if (typeof window.TossPayments === 'undefined') {
      console.error('TossPayments is not loaded');
      return;
    }

    const tossPayments = new window.TossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);

    tossPayments.requestPayment('카드', {
      amount: price,
      orderId: 'ORDER_ID_' + new Date().getTime(),
      orderName: `${type} 멤버십`,
      customerName: '고객',
      successUrl: `${window.location.origin}/membership/payment/success`,
      failUrl: `${window.location.origin}/membership/payment/fail`,
    }).catch((error: any) => {
      if (error.code === 'USER_CANCEL') {
        // 사용자가 결제창을 닫았을 때 처리
        console.log('사용자가 결제를 취소했습니다.');
      } else {
        // 기타 오류 처리
        console.error('결제 오류가 발생했습니다:', error);
      }
    });
  }, [isPaymentEnabled, type, price]);

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <h2>결제 수단 선택</h2>
          <div className={styles.paymentMethods}>
            {['신용카드', '실시간계좌이체', '가상계좌', '휴대폰결제'].map((method) => (
              <label key={method} className={styles.paymentMethod}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {method}
              </label>
            ))}
          </div>
          <div className={styles.agreements}>
            <label className={styles.agreement}>
              <input
                type="checkbox"
                name="all"
                checked={checkboxes.all}
                onChange={handleCheckboxChange}
              />
              전체 동의
            </label>
            <label className={styles.agreement}>
              <input
                type="checkbox"
                name="terms"
                checked={checkboxes.terms}
                onChange={handleCheckboxChange}
              />
              이용약관 동의 (필수)
            </label>
            <label className={styles.agreement}>
              <input
                type="checkbox"
                name="privacy"
                checked={checkboxes.privacy}
                onChange={handleCheckboxChange}
              />
              개인정보 처리방침 동의 (필수)
            </label>
            <label className={styles.agreement}>
              <input
                type="checkbox"
                name="marketing"
                checked={checkboxes.marketing}
                onChange={handleCheckboxChange}
              />
              마케팅정보 수신 동의 (선택)
            </label>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <h2>Membership : {type}</h2>
          <div className={styles.priceDetails}>
            <div className={styles.priceRow}>
              <span>멤버십 금액</span>
              <span>{price.toLocaleString()} 원</span>
            </div>
            <div className={styles.priceRow}>
              <span>할인 금액</span>
              <span className={styles.discountPrice}>0 원</span>
            </div>
            <div className={styles.priceRow}>
              <span>특별 할인 금액</span>
              <span className={styles.discountPrice}>0 원</span>
            </div>
            <div className={styles.priceRow}>
              <span>제휴카드 할인 금액</span>
              <span className={styles.discountPrice}>0 원</span>
            </div>
          </div>
        </div>
      </div>
      <button 
        onClick={handlePayment}
        className={`${styles.paymentButton} ${!isPaymentEnabled ? styles.disabledButton : ''}`}
        disabled={!isPaymentEnabled}
      >
        결제하기
      </button>
    </div>
  );
};

export default PaymentContent;
