'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <Image src="/assets/logo-full.png" alt="Kollect Logo" width={200} height={106} style={{ objectFit: 'contain' }} />
        </div>

        <nav style={styles.navMenu}>
          <Link href="/feeds" style={styles.navItem}>home</Link>
          <Link href="/search" style={styles.navItem}>search</Link>
          <Link href="/explore" style={styles.navItem}>explore</Link>
          <Link href="/messages" style={styles.navItem}>messages</Link>
          <Link href="/notifications" style={styles.navItem}>notifications</Link>
          <Link href="/create" style={styles.navItem}>create</Link>
          <Link href="/profile" style={styles.navItem}>profile</Link>
          <Link href="/work" style={styles.navItem}>work</Link>
        </nav>
      </div>

      {/* Page content */}
      <div style={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'white',
  },
  sidebar: {
    width: '260px',
    background: '#fff',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    zIndex: 100,
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
  },
  logo: { marginBottom: '50px', paddingLeft: '10px' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: {
    padding: '14px 18px',
    borderRadius: '12px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    padding: '40px 60px',
    zIndex: 10,
  },
};