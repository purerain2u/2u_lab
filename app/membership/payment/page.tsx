'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './PaymentPage.module.css';
import dynamic from 'next/dynamic';

const DynamicPaymentContent = dynamic(() => import('./components/PaymentContent'), {
  ssr: false,
  loading: () => <p>결제 정보를 불러오는 중...</p>
});

const PaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [type, setType] = useState<string>('Basic');
  const [price, setPrice] = useState<number>(50000);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const typeParam = searchParams.get('type');
    const priceParam = searchParams.get('price');
    
    if (typeParam) setType(typeParam);
    if (priceParam) {
      const parsedPrice = parseInt(priceParam, 10);
      if (!isNaN(parsedPrice)) setPrice(parsedPrice);
    }
  }, [searchParams]);

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.leftContent}>
            <Link href="/" className={styles.logo}>
              2U_lab
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/target-search" className={styles.navItem}>타겟영상검색</Link>
            <Link href="/100m-view" className={styles.navItem}>100M view 따라잡기</Link>
            <Link href="/target-source-collection" className={styles.navItem}>타겟소스수집목록</Link>
            <Link href="/membership" className={styles.navItem}>멤버십 신청</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>결제 페이지</h1>
        <DynamicPaymentContent type={type} price={price} />
      </main>
    </div>
  );
};

export default PaymentPage;
