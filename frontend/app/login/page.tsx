'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import EyeIcon from '../signup/EyeIcon';
import styles from './LoginPage.module.css';
import landingStyles from '../LandingPage.module.css';
import PageVisitLogger from '../../components/PageVisitLogger';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const logger = new PageVisitLogger({ pageType: 'login' });
    logger.logPageVisit();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      if (response.data.success) {
        router.push('/main');
      } else {
        setError(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('이 기능은 현재 개발 중입니다. 곧 이용하실 수 있습니다!');
  };

  return (
    <div className={styles.pageWrapper}>
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
      <main className={styles.container}>
        <h1 className={styles.title}>로그인</h1>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="email" className="sr-only">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.passwordInputWrapper}>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={styles.input}
                disabled={isLoading}
              />
              {isMounted && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  disabled={isLoading}
                >
                  <EyeIcon isVisible={showPassword} />
                </button>
              )}
            </div>
          </div>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className={styles.links}>
          <a href="#" onClick={handleComingSoon} className={styles.link}>
            아이디 찾기
          </a>
          <a href="#" onClick={handleComingSoon} className={styles.link}>
            비밀번호 찾기
          </a>
          <Link href="/signup" className={styles.link}>
            회원가입
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
