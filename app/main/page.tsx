'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './MainPage.module.css';

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={`${styles.logo} ${styles.blueText}`}>
          2U_LAB
        </Link>
        <nav className={styles.nav}>
          <Link href="/about" className={styles.navLink}>ABOUT 2U</Link>
          <Link href="/services" className={styles.navLink}>2ULab SERVICES</Link>
          <Link href="/contact" className={styles.navLink}>CONTACT US</Link>
        </nav>
        <button onClick={() => setIsMenuOpen(true)} className={styles.menuButton}>
          ☰
        </button>
      </header>

      <main className={styles.main}>
        <h2 className={styles.mainTitle}>유튜브 크리에이터의 성공을 데이터로 분석하다</h2>
        <p className={styles.mainDescription}>
          2U_lab은 AI 기반 유튜브 분석 솔루션을 통해 크리에이터의 성장을 지원합니다.
        </p>

        <div className={styles.buttonContainer}>
          <Link href="/target-search" className={styles.mainButton}>
            타겟영상 검색
            <span className={styles.buttonDescription}>유사한 콘텐츠의 성공 요인을 분석합니다</span>
          </Link>
          <Link href="/100m-view" className={styles.mainButton}>
            100M View 따라잡기
            <span className={styles.buttonDescription}>100M View 영상의 주요 요소를 분석하고 학습합니다</span>
          </Link>
          <Link href="/target-source-collection" className={styles.mainButton}>
            타겟소스 수집
            <span className={styles.buttonDescription}>트렌드에 맞는 콘텐츠 아이디어를 제공합니다</span>
          </Link>
          <Link href="/membership" className={styles.mainButton}>
            멤버십 신청
            <span className={styles.buttonDescription}>더 많은 기능을 이용해보세요.</span>
          </Link>
        </div>
      </main>

      {isMenuOpen && (
        <nav className={styles.menu}>
          <button onClick={() => setIsMenuOpen(false)} className={styles.closeButton}>
            ×
          </button>
          <Link href="/usage" className={styles.menuItem}>이용횟수 확인</Link>
          <Link href="/guide" className={styles.menuItem}>가이드</Link>
          <Link href="/settings" className={styles.menuItem}>설정</Link>
          <Link href="/notifications" className={styles.menuItem}>알림</Link>
          <Link href="/mypage" className={styles.menuItem}>마이페이지</Link>
        </nav>
      )}
    </div>
  );
}
