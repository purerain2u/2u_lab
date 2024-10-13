import Link from 'next/link';
import Image from 'next/image';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>2U_lab</Link>
          <div className={styles.navLinks}>
            <Link href="/about">ABOUT 2U</Link>
            <Link href="/services">2ULab SERVICES</Link>
            <Link href="/contact">CONTACT US</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <h1>유튜브 크리에이터의 성공을<br />데이터로 디자인하다</h1>
          <p>2U_lab은 AI 기반 유튜브 분석 솔루션을 통해<br />크리에이터의 성장을 지원합니다.</p>
          <div className={styles.buttons}>
            <Link href="/signup" className={styles.button}>회원가입</Link>
            <Link href="/login" className={styles.button}>로그인</Link>
          </div>
        </section>

        <section className={styles.services}>
          <h2>주요 서비스</h2>
          <div className={styles.serviceGrid}>
            <div className={styles.serviceItem}>
              <h3>AI 영상 분석</h3>
              <p>딥러닝 기술을 활용한 영상 콘텐츠 분석으로 성공 요인을 파악합니다.</p>
            </div>
            <div className={styles.serviceItem}>
              <h3>트랜드 예측</h3>
              <p>썸네일 분석과 100만View 영상 패턴학습을 통한 인기 주제와 형식을 예측합니다.</p>
            </div>
            <div className={styles.serviceItem}>
              <h3>맞춤형 전략 수립</h3>
              <p>개별 크리에이터에 최적화된 콘텐츠 전략을 제안합니다.</p>
            </div>
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

        <section className={styles.cta}>
          <h2>지금 바로 시작하세요</h2>
          <p>2U_lab과 함께 유튜브 성공을 향한 여정을 시작하세요.</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 2U_lab. All rights reserved.</p>
      </footer>
    </div>
  );
}