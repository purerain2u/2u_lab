'use client';

import ComingSoon from '../components/ComingSoon';
import { useRouter } from 'next/navigation';

export default function Services() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return <ComingSoon title="2ULab Introduction" onBack={handleBack} />;
}
