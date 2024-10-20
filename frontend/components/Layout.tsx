import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>2U_lab</Link>
          <div className={styles.navLinks}>
            <Link href="/about" className={styles.navLink}>ABOUT 2U</Link>
            <Link href="/services" className={styles.navLink}>2ULab SERVICES</Link>
            <Link href="/contact" className={styles.navLink}>CONTACT US</Link>
            <Link href="/target-search" className={styles.navLink}>타겟영상찾기</Link>
            <Link href="/100m-view" className={styles.navLink}>100M view 따라잡기</Link>
            <Link href="/target-source-collection" className={styles.navLink}>타겟소스수집목록</Link>
            <Link href="/membership" className={styles.navLink}>멤버십 신청</Link>
          </div>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} 2U_lab. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
