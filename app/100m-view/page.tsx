import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './100MViewPage.module.css';

export default function HundredMViewPage() {
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
            2U_Lab을 활용하여 100만 뷰 달성을 위한 다양한 요소를 분석하고 개선해보세요.
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
            <h2 className={styles.cardTitle}>100만 뷰 대본 연습하기</h2>
            <p className={styles.cardDescription}>
              100만 뷰 영상 대본 분석 학습을 통해 시청시간을 늘리는 효과적인 대본을 작성실습 할 수 있습니다.
            </p>
            <Link href="/100m-view/script" className={styles.startButton}>
              시작하기
            </Link>
            <p className={styles.imageLabel}>&#60;100만 뷰 대본 연습 예&#62;</p>
            <div className={styles.imageContainer}>
              <Image 
                src="/image/Script_example.png" 
                alt="대본 예시" 
                width={500} 
                height={300}
                layout="responsive"
              />
            </div>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>100만 뷰 영상 제목 생성하기</h2>
            <p className={styles.cardDescription}>
              알고리즘을 유도하는 매력적인 제목생성 방법을 제안하고 실습할 수 있습니다.
            </p>
            <Link href="/100m-view/title" className={styles.startButton}>
              시작하기
            </Link>
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
}