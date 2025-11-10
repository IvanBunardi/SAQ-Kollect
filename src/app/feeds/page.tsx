'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Feeds() {
  const [activeNav, setActiveNav] = useState('home');

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
        {/* Left side circles */}
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, top: '-180px', left: '-180px', animationDelay: '0s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-120px', left: '120px', animationDelay: '2s'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.big, top: '50px', left: '150px', animationDelay: '1s'}}></div>
        <div style={{...styles.circle, ...styles.verylightblue, ...styles.medium, top: '10px', left: '90px', animationDelay: '3s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.small, top: '120px', left: '20px', animationDelay: '4s'}}></div>
        
        <div style={{...styles.circle, ...styles.lightpink, ...styles.big, top: '280px', left: '200px', animationDelay: '2.5s'}}></div>
        <div style={{...styles.circle, ...styles.blue, ...styles.medium, top: '320px', left: '50px', animationDelay: '1.5s'}}></div>
        <div style={{...styles.circle, ...styles.verylightblue, ...styles.small, top: '350px', left: '150px', animationDelay: '5s'}}></div>
        
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, bottom: '-150px', left: '-120px', animationDelay: '1s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-80px', left: '180px', animationDelay: '3s'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.big, bottom: '80px', left: '100px', animationDelay: '2s'}}></div>
        <div style={{...styles.circle, ...styles.verylightblue, ...styles.medium, bottom: '120px', left: '200px', animationDelay: '4s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.small, bottom: '200px', left: '30px', animationDelay: '3.5s'}}></div>
        <div style={{...styles.circle, ...styles.cream, ...styles.tiny, bottom: '160px', left: '150px', animationDelay: '6s'}}></div>
        
        {/* Right side circles */}
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, top: '-160px', right: '-160px', animationDelay: '2s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-100px', right: '140px', animationDelay: '4s'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.big, top: '60px', right: '120px', animationDelay: '1s'}}></div>
        <div style={{...styles.circle, ...styles.verylightblue, ...styles.medium, top: '20px', right: '80px', animationDelay: '5s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.small, top: '140px', right: '40px', animationDelay: '3s'}}></div>
        
        <div style={{...styles.circle, ...styles.blue, ...styles.medium, top: '280px', right: '30px', animationDelay: '6s'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.small, top: '350px', right: '120px', animationDelay: '2.5s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.tiny, top: '400px', right: '80px', animationDelay: '4.5s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.small, top: '450px', right: '180px', animationDelay: '7s'}}></div>
        
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, bottom: '-140px', right: '-120px', animationDelay: '3s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-60px', right: '160px', animationDelay: '1s'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.big, bottom: '100px', right: '80px', animationDelay: '5s'}}></div>
        <div style={{...styles.circle, ...styles.verylightblue, ...styles.medium, bottom: '140px', right: '200px', animationDelay: '2s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.small, bottom: '180px', right: '20px', animationDelay: '6s'}}></div>
        <div style={{...styles.circle, ...styles.darkblue, ...styles.tiny, bottom: '220px', right: '120px', animationDelay: '4s'}}></div>
      </div>

      <div style={styles.container}>
        {/* Sidebar */}
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
            <Link href="/profile" style={styles.navItem}>
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
          <h1 style={styles.pageTitle}>Feeds</h1>
          
          <div style={styles.feedGrid}>
            {/* Feed Card 1 - Blue with images */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #a5c8f0, #c8ddf0)'}}>
              <div style={styles.feedHeader}>
                <div style={styles.userAvatar}></div>
                <div style={styles.userInfo}>
                  <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>Felix Tan</h3>
                  <p style={{margin: 0, fontSize: '13px', color: '#666'}}>2 hours ago</p>
                </div>
              </div>
              
              <div style={styles.feedText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
              </div>
              
              <div style={styles.feedImages}>
                <div style={styles.feedImage}>
                  <div style={styles.scoreCircle}>7.9</div>
                </div>
                <div style={styles.feedImage}>
                  <div style={styles.mysterySilhouette}></div>
                  <div style={styles.mysteryText}>???</div>
                </div>
              </div>
              
              <div style={styles.feedActions}>
                <div style={styles.actionButtons}>
                  <button style={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <button style={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                  <button style={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
                <div style={styles.playBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Empty gray card 1 */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)', minHeight: '300px'}}></div>

            {/* Empty gray card 2 */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)', minHeight: '300px'}}></div>

            {/* Empty gray card 3 */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)', minHeight: '300px'}}></div>

            {/* Feed Card 2 - Blue with images */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #a5c8f0, #c8ddf0)'}}>
              <div style={styles.feedHeader}>
                <div style={styles.userAvatar}></div>
                <div style={styles.userInfo}>
                  <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>Felix Tan</h3>
                  <p style={{margin: 0, fontSize: '13px', color: '#666'}}>2 hours ago</p>
                </div>
              </div>
              
              <div style={styles.feedText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
              </div>
              
              <div style={styles.feedImages}>
                <div style={styles.feedImage}>
                  <div style={styles.scoreCircle}>8.2</div>
                </div>
                <div style={styles.feedImage}>
                  <div style={styles.mysterySilhouette}></div>
                  <div style={styles.mysteryText}>???</div>
                </div>
              </div>
              
              <div style={styles.feedActions}>
                <div style={styles.actionButtons}>
                  <button style={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <button style={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                  <button style={styles.actionBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
                <div style={styles.playBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Empty gray card 4 */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)', minHeight: '300px'}}></div>

            {/* Empty gray card 5 */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)', minHeight: '400px'}}></div>

            {/* Empty gray card 6 */}
            <div style={{...styles.feedCard, background: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)', minHeight: '250px'}}></div>
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
  darkblue: { background: '#2952cc' },
  lightblue: { background: '#a5c8f0' },
  verylightblue: { background: '#c8ddf0' },
  cream: { background: '#f0f0f0' },
  huge: { width: '350px', height: '350px' },
  extrabig: { width: '280px', height: '280px' },
  big: { width: '200px', height: '200px' },
  medium: { width: '140px', height: '140px' },
  small: { width: '90px', height: '90px' },
  tiny: { width: '60px', height: '60px' },
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
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    padding: '40px 60px',
    zIndex: 10,
  },
  pageTitle: {
    fontSize: '38px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '35px',
    marginLeft: '10px',
  },
  feedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '25px',
    maxWidth: '1200px',
    paddingBottom: '50px',
  },
  feedCard: {
    borderRadius: '24px',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
  },
  feedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #555, #888)',
  },
  userInfo: {},
  feedText: {
    fontSize: '15px',
    color: '#333',
    marginBottom: '18px',
    lineHeight: '1.6',
  },
  feedImages: {
    display: 'flex',
    gap: '12px',
    marginBottom: '18px',
  },
  feedImage: {
    flex: 1,
    height: '180px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #1a1a2e, #0f0f1e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scoreCircle: {
    width: '75px',
    height: '75px',
    border: '3px solid #4dd0e1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    color: '#4dd0e1',
    fontWeight: 'bold',
  },
  mysterySilhouette: {
    width: '70px',
    height: '70px',
    background: '#000',
    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  },
  mysteryText: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    background: 'rgba(77, 208, 225, 0.2)',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #4dd0e1',
    fontSize: '14px',
    color: '#4dd0e1',
    fontWeight: 'bold',
  },
  feedActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  actionBtn: {
    width: '38px',
    height: '38px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: '#666',
  },
  playBtn: {
    width: '46px',
    height: '46px',
    background: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
    color: '#333',
  },
};