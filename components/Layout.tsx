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
          </div>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2024 2U_lab. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
