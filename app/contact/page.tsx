'use client';

import ComingSoon from '../components/ComingSoon';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

<<<<<<< HEAD
  return <ComingSoon title="연락처" onBack={handleBack} />;
=======
  return <ComingSoon title="Contact Us" onBack={handleBack} />;
>>>>>>> 9a384b9 (Initial commit: API 엔드포인트 구현, 데이터베이스 연결 및 기본 쿼리 구현)
}
