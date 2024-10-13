import React from 'react';
import styles from '../PaymentPage.module.css';

interface PaymentStatusProps {
  status: 'success' | 'failure';
  paymentMethod: string;
  price: number;
  onClose: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, paymentMethod, price, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>결제 {status === 'success' ? '완료' : '실패'}</h2>
        <p>결제 방법: {paymentMethod}</p>
        <p>결제 금액: {price.toLocaleString()}원</p>
        {status === 'success' && (
          <p>결제가 성공적으로 완료되었습니다. 감사합니다.</p>
        )}
        {status === 'failure' && (
          <p>결제에 실패했습니다. 다시 시도해주세요.</p>
        )}
        <button onClick={onClose} className={styles.closeButton}>닫기</button>
      </div>
    </div>
  );
};

export default PaymentStatus;