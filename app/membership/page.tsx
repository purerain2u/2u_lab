'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './MembershipPage.module.css';

const membershipPlans = [
  { name: 'Free', price: 0, features: ['영상 찾기 2회', '타겟소스수집 X', '제목 분석 리포트 1회'] },
  { name: 'Bronze', price: 29900, features: ['영상 찾기 10회', '타겟소스수집 30회', '제목 분석 리포트 5회'] },
  { name: 'Silver', price: 59900, features: ['영상 찾기 30회', '타겟소스수집 90회', '제목 분석 리포트 15회'] },
  { name: 'Gold', price: 209800, features: ['영상 찾기 100회', '타겟소스수집 300회', '제목 분석 리포트 30회'] },
  { name: 'Diamond', price: 359800, features: ['영상 찾기 300회', '타겟소스수집 1000회', '제목 분석 리포트 100회'] }
];

const benefitData = [
  { category: '타겟영상찾기', free: 2, bronze: 10, silver: 30, gold: 100, diamond: 300, master: '무제한' },
  { category: '영상 분석', free: 1, bronze: 5, silver: 15, gold: 30, diamond: 100, master: '무제한' },
  { category: '제목 분석 리포트', free: 1, bronze: 5, silver: 15, gold: 30, diamond: 100, master: '무제한' },
  { category: 'Best 채널 영상 학습', free: 2, bronze: 10, silver: 30, gold: 60, diamond: 200, master: '무제한' },
  { category: '타겟소스수집', free: '불가능', bronze: '30', silver: '60', gold: '120', diamond: '300', master: '무제한' }
];

const MembershipPage: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // 또는 로딩 인디케이터
  }

  const categories = [
    { name: '타겟영상찾기', path: '/target-search' },
    { name: '100M view 따라잡기', path: '/100m-view' },
    { name: '타겟소스수집목록', path: '/target-source-collection' },
    { name: '멤버십 신청', path: '/membership' }
  ];

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.leftContent}>
            <Link href="/" className={`${styles.logo} ${styles.blueText}`}>
              2U_lab
            </Link>
          </div>
          <nav className={styles.nav}>
            {categories.map((category) => (
              <Link 
                key={category.name}
                href={category.path}
                className={`${styles.navItem} ${hoveredCategory === category.name ? styles.blueText : ''}`}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory('')}
              >
                {category.name}
              
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.sectionTitle}>&lt;멤버십 신청&gt;</h1>
        <div className={styles.plansContainerWrapper}>
          <div className={styles.plansContainer}>
            {membershipPlans.map((plan) => (
              <div key={plan.name} className={`${styles.planCard} ${styles[plan.name.toLowerCase()]}`}>
                {plan.name === 'Gold' && <div className={styles.bestBadge}>BEST</div>}
                <h2>{plan.name}</h2>
                <p className={styles.price}>￦{plan.price.toLocaleString()} <span>/30일</span></p>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.available}>{feature}</li>
                  ))}
                </ul>
                <Link href={`/membership/payment?type=${plan.name}&price=${plan.price}`}>
                  <button className={styles.subscribeButton}>멤버십 구독하기</button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <h2 className={styles.sectionTitle}>&lt;멤버십 선택 비교&gt;</h2>

        <table className={styles.benefitTable}>
          <thead>
            <tr>
              <th>기능</th>
              {membershipPlans.map(plan => <th key={plan.name}>{plan.name}</th>)}
              <th>Master</th>
            </tr>
          </thead>
          <tbody>
            {benefitData.map((benefit, index) => (
              <tr key={index}>
                <td>{benefit.category}</td>
                <td>{benefit.free}</td>
                <td>{benefit.bronze}</td>
                <td>{benefit.silver}</td>
                <td>{benefit.gold}</td>
                <td>{benefit.diamond}</td>
                <td>{benefit.master}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className={styles.sectionTitle}>&lt;멤버십 신청시 유의사항&gt;</h2>
        <section className={styles.notice}>
          <ul>
            <li>멤버십 결제와 동시에 30일간 이용이 가능하며, 자동결제로 31일째 되는 날 동일기준으로 재결제되어 이용횟수가 초기화됩니다.</li>
            <li>멤버십 업그레이드 결제 시 당일부터 바로 이용되며, 기존 등급 결제 건은 이용 횟수 만큼 부분계산되어 업그레이드 결제 시 차감됩니다.</li>
            <li>멤버십을 비활성화하실 경우 멤버십 결제와 동시에 30일까지 이용되며, 31일째 되는 날 멤버십이 종료됩니다.</li>
            <li>멤버십 결제 취소 시 환불은 결제 후 14일까지, 무료 멤버십 이용 서비스 이용내역이 없을 시 가능하며 10% 수수료를 제외한 금액이 환불됩니다.</li>
            <li>환불의 경우 결제 방법에 따라 최대 7일 이상 소요될 수 있습니다.</li>
            <li>멤버십 정기 결제 실패 시 다음 결제일까지 이용이 제한되고 이용하신 데이터는 모두 삭제되어 복구 불가능합니다.</li>
            <li>정기 결제시에 카드오류의 문제로 결제가 되지 않으면 3일간 멤버십이 일시 중지되며, 이후 7일에 1번씩 총 4회까지 재결제를 시도합니다.</li>
            <li>마지막 결제시도까지 결제가 되지 않으면 멤버십이 최종 해지되며, 이용하신 데이터는 영구 삭제됩니다.</li>
            <li>자동결제 실패시 자동연장이 되거나 일정 기간 내 다른 결제 수단을 등록하여 정기 결제를 다시 진행하실 수 있습니다.</li>
            <li>멤버십 이용중 취한 분석 및 이용 금액은 자동 환불되지 않으며 이용하신 데이터는 영구 삭제됩니다.</li>
            <li>모든 금액은 부가세(VAT) 포함 가격입니다.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default MembershipPage;