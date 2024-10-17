'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './ComingSoon.module.css';

interface ComingSoonProps {
  title: string;
  backTo?: string;
  onBack?: () => void;
  message?: string;
}

const ComingSoon: FC<ComingSoonProps> = ({ title, backTo, onBack, message }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      router.push(backTo);
    } else {
      router.push('/100m-view'); // 기본값으로 메인 페이지 설정
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image
            src="/comingsoon.png"
            alt="Coming Soon"
            width={400}
            height={400}
            className={styles.image}
            onError={(e) => {
              console.error('Image failed to load', e);
            }}
          />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message || "해당 페이지는 현재 준비 중입니다."}</p>
        <p className={styles.message}>곧 멋진 컨텐츠로 찾아뵙겠습니다!</p>
        <button
          onClick={handleBackClick}
          className={styles.backButton}
        >
          {backTo === '/' ? '랜딩 페이지로 돌아가기' : 'Main으로 돌아가기'}
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
