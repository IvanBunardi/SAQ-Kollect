'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ExplorePage() {
  const [activeNav, setActiveNav] = useState('explore');

  // Sample data
  const trendingKols = [
    { name: 'Felix Tan', category: 'Tech', color: '#e8b4d4' },
    { name: 'Felix Tan', category: 'Tech', color: '#e357a3' },
    { name: 'Felix Tan', category: 'Tech', color: '#a5c8f0' },
    { name: 'Felix Tan', category: '', color: '#e8e8e8' },
  ];

  const trendingCompanies = [
    { name: 'Felix Tan', category: 'Tech', color: '#e8b4d4' },
    { name: 'Felix Tan', category: 'Tech', color: '#e357a3' },
    { name: 'Felix Tan', category: 'Tech', color: '#a5c8f0' },
    { name: 'Felix Tan', category: '', color: '#e8e8e8' },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33%  { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          66%  { transform: translateY(15px) translateX(-10px) rotate(-3deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>

      {/* Floating Background Circles */}
      <div style={styles.circles}>
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, top: '-180px', left: '-180px' }}></div>
        <div style={{ ...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-120px', left: '120px' }}></div>
        <div style={{ ...styles.circle, ...styles.lightblue, ...styles.big, top: '50px', left: '150px' }}></div>
        <div style={{ ...styles.circle, ...styles.pink, ...styles.small, top: '120px', left: '20px' }}></div>
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, bottom: '-150px', left: '-120px' }}></div>
        <div style={{ ...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-80px', left: '180px' }}></div>
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, top: '-160px', right: '-160px' }}></div>
        <div style={{ ...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-100px', right: '140px' }}></div>
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, bottom: '-140px', right: '-120px' }}></div>
        <div style={{ ...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-60px', right: '160px' }}></div>
      </div>

      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.logo}>
            <Image src="/assets/logo-full.png" alt="Kollect Logo" width={200} height={106} style={{ objectFit: 'contain' }} />
          </div>

          <nav style={styles.navMenu}>
            <Link href="/feeds" style={{ ...styles.navItem, ...(activeNav === 'home' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>home</span>
            </Link>

            <Link href="/search" style={{ ...styles.navItem, ...(activeNav === 'search' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>search</span>
            </Link>

            <Link href="/explore" style={{ ...styles.navItem, ...(activeNav === 'explore' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>explore</span>
            </Link>

            <Link href="/messages" style={{ ...styles.navItem, ...(activeNav === 'messages' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>messages</span>
            </Link>

            <Link href="/notifications" style={{ ...styles.navItem, ...(activeNav === 'notifications' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>notifications</span>
            </Link>

            <Link href="/create" style={{ ...styles.navItem, ...(activeNav === 'create' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>create</span>
            </Link>

            <Link href="/profile" style={{ ...styles.navItem, ...(activeNav === 'profile' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>profile</span>
            </Link>

            <Link href="/work" style={{ ...styles.navItem, ...(activeNav === 'work' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>work</span>
            </Link>
          </nav>

          {/* Decorative Circles */}
          <div style={styles.sidebarDecoration}>
            <div style={{ ...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0' }}></div>
            <div style={{ ...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <h1 style={styles.pageTitle}>Explore</h1>

          <h2 style={styles.sectionTitle}>Trending KOL's</h2>
          <div style={styles.cardGrid}>
            {trendingKols.map((kol, index) => (
              <div key={`kol-${index}`} style={{ ...styles.card, background: kol.color }}>
                <div style={styles.cardCircle}></div>
                {kol.name && (
                  <div style={styles.cardInfo}>
                    <p style={styles.cardName}>{kol.name}</p>
                    <p style={styles.cardCategory}>{kol.category}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 style={styles.sectionTitle}>Trending Companies</h2>
          <div style={styles.cardGrid}>
            {trendingCompanies.map((company, index) => (
              <div key={`company-${index}`} style={{ ...styles.card, background: company.color }}>
                <div style={styles.cardCircle}></div>
                {company.name && (
                  <div style={styles.cardInfo}>
                    <p style={styles.cardName}>{company.name}</p>
                    <p style={styles.cardCategory}>{company.category}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  circles: { position: 'fixed', width: '100%', height: '100%', overflow: 'hidden', zIndex: -1 },
  circle: { position: 'absolute', borderRadius: '50%', opacity: 1, animation: 'float 15s infinite ease-in-out' },
  pink: { background: '#e357a3' },
  lightpink: { background: '#f4a3c8' },
  blue: { background: '#4371f0' },
  lightblue: { background: '#a5c8f0' },
  huge: { width: '350px', height: '350px' },
  extrabig: { width: '280px', height: '280px' },
  big: { width: '200px', height: '200px' },
  small: { width: '90px', height: '90px' },

  container: { display: 'flex', minHeight: '100vh', background: 'white' },
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
  logo: { marginBottom: '50px', paddingLeft: '10px' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
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
    background: '#e8eaed',
    transition: 'all 0.2s ease',
  },
  navItemActive: { background: '#4371f0', color: 'white' },
  sidebarDecoration: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', overflow: 'hidden' },
  sidebarCircle: { position: 'absolute', borderRadius: '50%', opacity: 0.5, animation: 'float 12s infinite ease-in-out' },

  mainContent: { flex: 1, marginLeft: '260px', padding: '40px 60px', zIndex: 10 },
  pageTitle: { fontSize: '38px', fontWeight: '700', color: '#111', marginBottom: '35px' },
  sectionTitle: { fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '20px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '25px' },
  card: {
    borderRadius: '20px',
    padding: '25px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
  cardCircle: { width: '90px', height: '90px', borderRadius: '50%', background: 'white', marginBottom: '15px' },
  cardInfo: { textAlign: 'center' },
  cardName: { margin: 0, fontSize: '15px', fontWeight: '600', color: 'white', marginBottom: '3px' },
  cardCategory: { margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.9)' },
};