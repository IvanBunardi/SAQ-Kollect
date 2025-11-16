'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState('kol');
  const [activeNav, setActiveNav] = useState('search');

  const kolResults = Array(4).fill({
    name: 'Felix Tan',
    category: 'Tech',
    followers: '143K Followers'
  });

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
        .tab-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: #333;
          border-radius: 3px 3px 0 0;
        }
      `}</style>

      {/* Background Circles */}
      <div style={styles.circles}>
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, top: '-180px', left: '-180px' }}></div>
        <div style={{ ...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-120px', left: '120px' }}></div>
        <div style={{ ...styles.circle, ...styles.lightblue, ...styles.big, top: '50px', left: '150px' }}></div>
        <div style={{ ...styles.circle, ...styles.verylightblue, ...styles.medium, top: '10px', left: '90px' }}></div>
        <div style={{ ...styles.circle, ...styles.pink, ...styles.small, top: '120px', left: '20px' }}></div>
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
              <span>Home</span>
            </Link>

            <Link href="/search" style={{ ...styles.navItem, ...(activeNav === 'search' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>Search</span>
            </Link>

            <Link href="/explore" style={{ ...styles.navItem, ...(activeNav === 'explore' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>Explore</span>
            </Link>

            <Link href="/messages" style={{ ...styles.navItem, ...(activeNav === 'messages' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Messages</span>
            </Link>

            <Link href="/notifications" style={{ ...styles.navItem, ...(activeNav === 'notifications' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>Notifications</span>
            </Link>

            <Link href="/create" style={{ ...styles.navItem, ...(activeNav === 'create' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Create</span>
            </Link>

            <Link href="/profile" style={{ ...styles.navItem, ...(activeNav === 'profile' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </Link>

            <Link href="/work" style={{ ...styles.navItem, ...(activeNav === 'work' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Work</span>
            </Link>
            <Link href="/settings" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
              </svg>
              <span>Settings</span>
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
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchBar}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search" style={styles.searchInput} />
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabContainer}>
            <button
              style={{ ...styles.tab, ...(activeTab === 'kol' && styles.tabActive) }}
              className={activeTab === 'kol' ? 'tab-active' : ''}
              onClick={() => setActiveTab('kol')}
            >
              KOL's
            </button>
            <button
              style={{ ...styles.tab, ...(activeTab === 'company' && styles.tabActive) }}
              className={activeTab === 'company' ? 'tab-active' : ''}
              onClick={() => setActiveTab('company')}
            >
              Company
            </button>
          </div>

          {/* Results */}
          <div style={styles.resultsList}>
            {kolResults.map((kol, index) => (
              <div key={index} style={styles.resultItem}>
                <div style={styles.resultAvatar}></div>
                <div style={styles.resultInfo}>
                  <h3 style={styles.resultName}>{kol.name}</h3>
                  <p style={styles.resultMeta}>
                    {kol.category} | {kol.followers}
                  </p>
                </div>
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
  verylightblue: { background: '#c8ddf0' },
  huge: { width: '350px', height: '350px' },
  extrabig: { width: '280px', height: '280px' },
  big: { width: '200px', height: '200px' },
  medium: { width: '140px', height: '140px' },
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
    transition: 'all 0.2s ease',
    background: '#e8eaed',
  },
  navItemActive: { background: '#4371f0', color: 'white' },
  sidebarDecoration: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', overflow: 'hidden' },
  sidebarCircle: { position: 'absolute', borderRadius: '50%', opacity: 0.5, animation: 'float 12s infinite ease-in-out' },

  mainContent: { flex: 1, marginLeft: '260px', padding: '40px 60px', zIndex: 10 },
  searchContainer: { marginBottom: '30px' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '14px', background: '#f5f7fa', borderRadius: '50px', padding: '14px 26px', maxWidth: '850px' },
  searchInput: { flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: '#333', outline: 'none' },

  tabContainer: { display: 'flex', marginBottom: '25px', borderBottom: '2px solid #e5e5e5', maxWidth: '850px' },
  tab: { padding: '12px 0', marginRight: '35px', background: 'none', border: 'none', fontSize: '16px', fontWeight: '500', color: '#999', cursor: 'pointer' },
  tabActive: { color: '#333', fontWeight: '600' },

  resultsList: { display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '850px' },
  resultItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' },
  resultAvatar: { width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #ccc, #888)' },
  resultInfo: { flex: 1 },
  resultName: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' },
  resultMeta: { margin: 0, fontSize: '14px', color: '#666' },
};