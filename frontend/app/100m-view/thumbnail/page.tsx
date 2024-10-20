'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ThumbnailPage.module.css';
import BestThumbnailQuiz from './BestThumbnailQuiz';

export default function ThumbnailQuizPage() {
  return (
    <div className={styles.pageContainer}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logo}>
              2U_lab
            </Link>
          </div>
          <div className={styles.navLinks}>
            <Link href="/target-search" className={styles.navLink}>
              타겟영상검색
            </Link>
            <Link href="/100m-view" className={styles.navLink}>
              100M view 따라하기
            </Link>
            <Link href="/target-source-collection" className={styles.navLink}>
              타겟소스수집목록
            </Link>
            <Link href="/membership" className={styles.navLink}>
              멤버십 신청
            </Link>
          </div>
        </div>
      </nav>

      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Best 썸네일 구분하기</h1>
        <div className={styles.description}>
          <p>클릭을 부르는 Best 썸네일의 특징을 분석하여 효과적인 썸네일 제작 방법을 제시합니다</p>
        </div>
        <BestThumbnailQuiz />
      </div>
    </div>
  );
}
