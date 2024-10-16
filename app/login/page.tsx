'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        router.push('/main');
      } else {
        setError(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('로그인 에러:', error);
      if (error.response) {
        // 서버 응답이 있는 경우
        setError(`로그인 실패: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
      } else if (error.request) {
        // 요청은 전송되었지만 응답을 받지 못한 경우
        setError('서버와 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        setError('로그인 요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('이 기능은 현재 개발 중입니다. 곧 이용하실 수 있습니다!');
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
                minLength={8}
                className={styles.input}
              />
              {isMounted && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  <EyeIcon isVisible={showPassword} />
                </button>
              )}
            </div>
          </div>
          <button type="submit" className={styles.button}>로그인</button>
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
      </div>
    </div>
  );
};

export default LoginPage;
