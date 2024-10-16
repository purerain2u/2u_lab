'use client';

import ComingSoon from '../components/ComingSoon';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return <ComingSoon title="연락처" onBack={handleBack} />;
}
