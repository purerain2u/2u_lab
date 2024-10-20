'use client';

import React from 'react';
import Link from 'next/link';
import styles from './LandingPage.module.css';
import { useEffect } from 'react';
import PageVisitLogger from '@/components/PageVisitLogger';
export default function LandingPage() {
  useEffect(() => {
    const logger = new PageVisitLogger({ pageType: 'landing' });
    logger.logPageVisit();
    return () => {
      logger.cancelPendingLogs();
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            2U_lab
          </Link>
          <div className={styles.navLinks}>
            <Link href="/about" className={styles.navLink}>ABOUT 2U</Link>
            <Link href="/services" className={styles.navLink}>2ULab SERVICES</Link>
            <Link href="/contact" className={styles.navLink}>CONTACT US</Link>
            <Link href="/target-search" className={styles.navLink}>타겟영상찾기</Link>
            <Link href="/100m-view" className={styles.navLink}>100M view 따라잡기</Link>
            <Link href="/target-source-collection" className={styles.navLink}>타겟소스수집목록</Link>
            <Link href="/membership" className={styles.navLink}>멤버십 신청</Link>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>유튜브 성공을 위한 당신의 파트너, 2U_lab</h1>
          <p>데이터 기반의 인사이트로 당신의 채널을 성장시키세요</p>
          <Link href="/signup" className={styles.cta}>
            시작하기
          </Link>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <h2>타겟 영상 분석</h2>
            <p>성공한 영상들의 패턴을 분석하여 최적의 전략을 제시합니다.</p>
          </div>
          <div className={styles.feature}>
            <h2>맞춤형 컨설팅</h2>
            <p>각 채널의 특성에 맞는 맞춤형 성장 전략을 제공합니다.</p>
          </div>
          <div className={styles.feature}>
            <h2>트렌드 예측</h2>
            <p>빅데이터 분석을 통해 다가올 트렌드를 미리 파악합니다.</p>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.statItem}>
            <h3>1,000,000,000+</h3>
            <p>분석가능 영상</p>
          </div>
          <div className={styles.statItem}>
            <h3>5000+</h3>
            <p>만족한 크리에이터</p>
          </div>
          <div className={styles.statItem}>
            <h3>42% +</h3>
            <p>평균 구독/조회수 증가율</p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>지금 시작하세요</h2>
          <p>2U_lab과 함께 유튜브 성공을 위한 여정을 시작하세요!</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} 2U_lab. All rights reserved.</p>
      </footer>
    </div>
  );
}
