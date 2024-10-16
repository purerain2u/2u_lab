'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './ComingSoon.module.css';

interface ComingSoonProps {
  title: string;
  onBack: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, onBack }) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (title === '100만 뷰 스크립트 학습하기' || title === '100만 뷰 영상 제목 생성하기') {
      router.push('/membership');
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <p>이 페이지는 현재 준비 중입니다. 곧 멋진 컨텐츠로 찾아뵙겠습니다!</p>
      <button
        onClick={handleBackClick}
        className={styles.backButton}
      >
        {title === '100만 뷰 스크립트 학습하기' || title === '100만 뷰 영상 제목 생성하기'
          ? '멤버십 페이지로 이동하기'
          : '홈으로 돌아가기'}
      </button>
    </div>
};

export default ComingSoon;
