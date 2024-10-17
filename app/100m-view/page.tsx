'use client';

<<<<<<< HEAD
import React, { useState } from 'react';
=======
import { useState } from 'react';
>>>>>>> 9a384b9 (Initial commit: API 엔드포인트 구현, 데이터베이스 연결 및 기본 쿼리 구현)
import Link from 'next/link';
import Image from 'next/image';
import styles from './100MViewPage.module.css';
import ComingSoon from '../components/ComingSoon';

export default function HundredMViewPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('');

  const handleComingSoonClick = (title: string) => {
    setComingSoonTitle(title);
    setShowComingSoon(true);
  };

  if (showComingSoon) {
<<<<<<< HEAD
    return <ComingSoon title={comingSoonTitle} onBack={() => setShowComingSoon(false)} />;
=======
    return (
      <ComingSoon 
        title={comingSoonTitle} 
        backTo="/100m-view"
        message={`${comingSoonTitle} 페이지는 현재 준비 중입니다.`}
        onBack={() => setShowComingSoon(false)}
      />
    );
>>>>>>> 9a384b9 (Initial commit: API 엔드포인트 구현, 데이터베이스 연결 및 기본 쿼리 구현)
  }

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
              타겟영상찾기
            </Link>
            <Link href="/100m-view" className={styles.navLink}>
              100M view 따라잡기
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

      <div className={styles.container}>
        <h1 className={styles.title}>100M View 따라잡기</h1>
        <div className={styles.subDescriptionWrapper}>
          <p className={styles.subDescription}>
            2U_Lab을 이용하여 100만 뷰 달성을 위한 다양한 요소를 분석하고 개선해보세요.
          </p>
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Best 썸네일 구분하기</h2>
            <p className={styles.cardDescription}>
              클릭을 부르는 Best 썸네일의 특징을 분석하여 효과적인 썸네일 제작 방법을 제시합니다.
            </p>
            <Link href="/100m-view/thumbnail" className={styles.startButton}>
              시작하기
            </Link>
            <p className={styles.imageLabel}>&#60;Best 썸네일 분석 예&#62;</p>
            <div className={styles.imageContainer}>
              <Image 
                src="/image/Thumbnail_example.png" 
                alt="썸네일 예시" 
                width={500} 
                height={300}
                layout="responsive"
              />
            </div>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>100만 뷰 스크립트 학습하기</h2>
            <p className={styles.cardDescription}>
              100만 뷰 이상 영상 분석 학습을 통해 시청시간과 구독자 수 증가에 효과적인 대본을 작성할 수 있습니다.
            </p>
            <button onClick={() => handleComingSoonClick('100만 뷰 스크립트 학습하기')} className={styles.startButton}>
              시작하기
            </button>
            <p className={styles.imageLabel}>&#60;100만 뷰 스크립트 학습 예&#62;</p>
            <div className={styles.imageContainer}>
              <Image 
                src="/image/Script_example.png" 
                alt="스크립트 예시" 
                width={500} 
                height={300}
                layout="responsive"
              />
            </div>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>100만 뷰 영상 제목 생성하기</h2>
            <p className={styles.cardDescription}>
              알고리즘에 도움되는 매력적인 제목생성 방법을 제안하고 학습할 수 있습니다.
            </p>
            <button onClick={() => handleComingSoonClick('100만 뷰 영상 제목 생성하기')} className={styles.startButton}>
              시작하기
            </button>
            <div className={styles.imageContainer}>
              <Image 
                src="/image/comingsoon.png" 
                alt="Coming Soon" 
                width={500} 
                height={300}
                layout="responsive"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 9a384b9 (Initial commit: API 엔드포인트 구현, 데이터베이스 연결 및 기본 쿼리 구현)
