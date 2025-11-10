'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  // Determine active nav based on current path
  const getActiveNav = () => {
    if (pathname === '/feeds') return 'home';
    if (pathname === '/search') return 'search';
    if (pathname === '/explore') return 'explore';
    if (pathname === '/messages') return 'messages';
    if (pathname === '/notifications') return 'notifications';
    if (pathname === '/create') return 'create';
    if (pathname === '/profile') return 'profile';
    if (pathname === '/work') return 'work';
    return 'home';
  };

  const activeNav = getActiveNav();

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <Image src="/assets/logo-full.png" alt="Kollect Logo" width={200} height={106} style={{objectFit: 'contain'}} />
      </div>
      
      <nav style={styles.navMenu}>
        <Link href="/feeds" style={{...styles.navItem, ...(activeNav === 'home' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>home</span>
        </Link>
        <Link href="/search" style={{...styles.navItem, ...(activeNav === 'search' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span>search</span>
        </Link>
        <Link href="/explore" style={{...styles.navItem, ...(activeNav === 'explore' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
          <span>explore</span>
        </Link>
        <Link href="/messages" style={{...styles.navItem, ...(activeNav === 'messages' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>messages</span>
        </Link>
        <Link href="/notifications" style={{...styles.navItem, ...(activeNav === 'notifications' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span>notifications</span>
        </Link>
        <Link href="/create" style={{...styles.navItem, ...(activeNav === 'create' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>create</span>
        </Link>
        <Link href="/profile" style={{...styles.navItem, ...(activeNav === 'profile' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>profile</span>
        </Link>
        <Link href="/work" style={{...styles.navItem, ...(activeNav === 'work' && styles.navItemActive)}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <span>work</span>
        </Link>
      </nav>
      
      {/* Decorative circles */}
      <div style={styles.sidebarDecoration}>
        <div style={{...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0'}}></div>
        <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s'}}></div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '260px',
    background: '#fafbfc',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    zIndex: 100,
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e8e8e8',
  },
  logo: {
    marginBottom: '50px',
    paddingLeft: '10px',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    borderRadius: '12px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    background: '#e8eaed',
  },
  navItemActive: {
    background: '#4371f0',
    color: 'white',
  },
  sidebarDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '200px',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  sidebarCircle: {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.5,
    animation: 'float 12s infinite ease-in-out',
  },
};