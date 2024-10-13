'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import EyeIcon from '../signup/EyeIcon';  // EyeIcon 컴포넌트의 경로를 확인하세요
import styles from './LoginPage.module.css';
import landingStyles from '../LandingPage.module.css';
import PageVisitLogger from '../../components/PageVisitLogger';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');


    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        router.push('/main');
      } else {
        setError(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('로그인 에러:', error);
      setError(error.response?.data?.message || '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <PageVisitLogger pageType="login" />
      <header className={landingStyles.header}>
        <nav className={landingStyles.nav}>
          <Link href="/" className={landingStyles.logo}>2U_lab</Link>
          <div className={landingStyles.navLinks}>
            <Link href="/about">ABOUT 2U</Link>
            <Link href="/services">2ULab SERVICES</Link>
            <Link href="/contact">CONTACT US</Link>
          </div>
        </nav>
      </header>
      <div className={styles.container}>
        <h1 className={styles.title}>로그인</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
              {isMounted && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  <EyeIcon isVisible={showPassword} />
                </button>
              )}
            </div>
          </div>
          <button type="submit" className={styles.button}>로그인</button>
        </form>
        <div className={styles.links}>
          <Link href="/forgot-id">아이디 찾기</Link>
          <Link href="/forgot-password">비밀번호 찾기</Link>
          <Link href="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
