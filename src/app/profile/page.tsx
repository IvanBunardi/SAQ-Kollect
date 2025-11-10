'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [activeNav, setActiveNav] = useState('profile');
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33%  { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          66%  { transform: translateY(15px) translateX(-10px) rotate(-3deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>

      {/* Background circles */}
      <div style={styles.circles}>
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, top: '-180px', left: '-180px', animationDelay: '0s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-120px', left: '120px', animationDelay: '2s'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.big, top: '50px', left: '150px', animationDelay: '1s'}}></div>
        
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, bottom: '-150px', left: '-120px', animationDelay: '1s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-80px', left: '180px', animationDelay: '3s'}}></div>
        
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, top: '-160px', right: '-160px', animationDelay: '2s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-100px', right: '140px', animationDelay: '4s'}}></div>
        
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, bottom: '-140px', right: '-120px', animationDelay: '3s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-60px', right: '160px', animationDelay: '1s'}}></div>
      </div>

      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.logo}>
            <Image src="/assets/logo-full.png" alt="Kollect Logo" width={200} height={106} style={{objectFit: 'contain'}} />
          </div>
          
          <nav style={styles.navMenu}>
            <Link href="/feeds" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Home</span>
            </Link>
            <Link href="/search" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span>Search</span>
            </Link>
            <Link href="/explore" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
              <span>Explore</span>
            </Link>
            <Link href="/messages" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Messages</span>
            </Link>
            <Link href="/notifications" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>Notifications</span>
            </Link>
            <Link href="/create" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Create</span>
            </Link>
            <Link href="/profile" style={{...styles.navItem, ...(activeNav === 'profile' && styles.navItemActive)}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Profile</span>
            </Link>
            <Link href="/work" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>Work</span>
            </Link>
          </nav>
          
          {/* Decorative circles */}
          <div style={styles.sidebarDecoration}>
            <div style={{...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0'}}></div>
            <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s'}}></div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Profile Header */}
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatar}>
              <Image src="/assets/fotopp.png" alt="Profile" width={150} height={150} style={{borderRadius: '50%', objectFit: 'cover'}} />
            </div>
            <div style={styles.profileInfo}>
              <h1 style={styles.profileUsername}>owenc.s</h1>
              <h2 style={styles.profileTitle}>KOL</h2>
              <p style={styles.profileCategory}>Fashion  Jakarta, Indonesia</p>
              <div style={styles.profileStats}>
                <span style={styles.stat}><strong>10K</strong> followers</span>
                <span style={styles.stat}><strong>539</strong> following</span>
              </div>
              <p style={styles.profileBio}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button style={styles.btnSecondary}>Following</button>
            <button style={styles.btnSecondary}>Message</button>
            <button 
              style={styles.btnPrimary}
              onClick={() => router.push('/hire-campaign')}
            >
              Hire for Campaign
            </button>
          </div>

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <button 
              style={{...styles.tab, ...(activeTab === 'profile' && styles.tabActive)}}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'work' && styles.tabInactive)}}
              onClick={() => setActiveTab('work')}
            >
              Work
            </button>
          </div>

          {/* Content Grid */}
          <div style={styles.contentGrid}>
            {/* Recent Campaigns Card */}
            <div style={{...styles.card, background: 'linear-gradient(135deg, #a5c8f0, #c8ddf0)'}}>
              <div style={styles.cardHeader}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <h3 style={styles.cardTitle}>Recent Campaigns</h3>
              </div>
              <div style={styles.cardContent}>
                {/* Empty white box for campaign preview */}
                <div style={styles.campaignPreview}></div>
              </div>
            </div>

            {/* Performance Metrics Card */}
            <div style={{...styles.card, background: 'linear-gradient(135deg, #e357a3, #f4a3c8)'}}>
              <div style={styles.cardHeader}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <h3 style={styles.cardTitle}>Performance Metrics</h3>
              </div>
              <div style={styles.metricsGrid}>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>5.4%</p>
                  <p style={styles.metricLabel}>Avg. Engagement Rate</p>
                </div>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>25K</p>
                  <p style={styles.metricLabel}>Avg. Per Post</p>
                </div>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>3.5%</p>
                  <p style={styles.metricLabel}>Click-Through Rate</p>
                </div>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>2.4%</p>
                  <p style={styles.metricLabel}>Conversion Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gray Placeholder Cards */}
          <div style={styles.placeholderGrid}>
            <div style={styles.placeholderCard}></div>
            <div style={styles.placeholderCardLarge}></div>
            <div style={styles.placeholderCard}></div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  circles: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: -1,
  },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 1,
    animation: 'float 15s infinite ease-in-out',
  },
  pink: { background: '#e357a3' },
  lightpink: { background: '#f4a3c8' },
  blue: { background: '#4371f0' },
  lightblue: { background: '#a5c8f0' },
  verylightblue: { background: '#c8ddf0' },
  huge: { width: '350px', height: '350px' },
  extrabig: { width: '280px', height: '280px' },
  big: { width: '200px', height: '200px' },
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'white',
  },
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
    background: '#e8eaed',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
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
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    padding: '40px 60px',
    zIndex: 10,
  },
  profileHeader: {
    display: 'flex',
    gap: '35px',
    marginBottom: '30px',
    alignItems: 'flex-start',
  },
  profileAvatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    border: '4px solid #f0f0f0',
  },
  profileInfo: {
    flex: 1,
  },
  profileUsername: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '5px',
  },
  profileTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '8px',
  },
  profileCategory: {
    margin: 0,
    fontSize: '16px',
    color: '#666',
    marginBottom: '15px',
  },
  profileStats: {
    display: 'flex',
    gap: '25px',
    marginBottom: '15px',
  },
  stat: {
    fontSize: '15px',
    color: '#333',
  },
  profileBio: {
    fontSize: '15px',
    color: '#333',
    lineHeight: '1.6',
    margin: 0,
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginBottom: '35px',
  },
  btnSecondary: {
    padding: '12px 28px',
    background: '#f0f2f5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnPrimary: {
    padding: '12px 28px',
    background: '#e357a3',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabsContainer: {
    display: 'flex',
    gap: '5px',
    marginBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
  },
  tab: {
    padding: '12px 0',
    marginRight: '30px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    color: '#999',
    cursor: 'pointer',
    position: 'relative',
    transition: 'color 0.2s',
  },
  tabActive: {
    color: '#333',
    fontWeight: '600',
  },
  tabInactive: {
    color: '#999',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '25px',
    marginBottom: '25px',
  },
  card: {
    borderRadius: '24px',
    padding: '28px',
    minHeight: '300px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
  },
  cardContent: {
    flex: 1,
  },
  campaignPreview: {
    width: '100%',
    height: '200px',
    background: 'white',
    borderRadius: '16px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  metricBox: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
  },
  metricValue: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '5px',
  },
  metricLabel: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  },
  placeholderGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    gap: '25px',
  },
  placeholderCard: {
    background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)',
    borderRadius: '24px',
    minHeight: '280px',
  },
  placeholderCardLarge: {
    background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)',
    borderRadius: '24px',
    minHeight: '280px',
  },
};