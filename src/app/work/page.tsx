'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WorkPage() {
  const [activeNav, setActiveNav] = useState('work');
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      company: 'MJ Toys',
      title: 'Product Launch Campaign',
      progress: 60,
      budget: '$1,000',
      engagement: '50 K',
      deadline: '2025 - 10 - 20',
      deliverables: 2,
      stories: 2,
      reels: 3,
      status: 'Active',
      statusColor: '#4caf50'
    },
    {
      company: 'MJ Toys',
      title: 'Product Launch Campaign',
      progress: 100,
      budget: '$1,000',
      engagement: '50 K',
      deadline: '2025 - 10 - 20',
      deliverables: 2,
      stories: 2,
      reels: 3,
      status: 'Done',
      statusColor: '#2196f3'
    }
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
              <span>home</span>
            </Link>
            <Link href="/search" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span>search</span>
            </Link>
            <Link href="/explore" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
              <span>explore</span>
            </Link>
            <Link href="/messages" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>messages</span>
            </Link>
            <Link href="/notifications" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>notifications</span>
            </Link>
            <Link href="/create" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>create</span>
            </Link>
            <Link href="/profile" style={styles.navItem}>
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

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* User Header */}
          <div style={styles.userHeader}>
            <div style={styles.userAvatar}>
              <Image src="/assets/fotomes.png" alt="User" width={60} height={60} style={{borderRadius: '50%', objectFit: 'cover'}} />
            </div>
            <h1 style={styles.userName}>Felix Tan</h1>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #e8eaf6, #f5f7fa)'}}>
              <div style={styles.statIcon}>
                <div style={{...styles.iconCircle, background: '#e8b4d4'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
              </div>
              <h2 style={styles.statValue}>2</h2>
              <p style={styles.statLabel}>Active Project</p>
            </div>

            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #e8f5e9, #f5f7fa)'}}>
              <div style={styles.statIcon}>
                <div style={{...styles.iconCircle, background: '#b4e8cc'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
              </div>
              <h2 style={styles.statValue}>$ 10 K</h2>
              <p style={styles.statLabel}>Total Earnings</p>
            </div>

            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #e3f2fd, #f5f7fa)'}}>
              <div style={styles.statIcon}>
                <div style={{...styles.iconCircle, background: '#a5c8f0'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </div>
              <h2 style={styles.statValue}>10.5 K</h2>
              <p style={styles.statLabel}>Avg. Engagement</p>
            </div>

            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f3e5f5, #f5f7fa)'}}>
              <div style={styles.statIcon}>
                <div style={{...styles.iconCircle, background: '#e8b4d4'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
              </div>
              <h2 style={styles.statValue}>5</h2>
              <p style={styles.statLabel}>This Month</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={styles.filterButtons}>
            <button 
              style={{...styles.filterBtn, ...(activeFilter === 'all' && styles.filterBtnActive)}}
              onClick={() => setActiveFilter('all')}
            >
              All Projects
            </button>
            <button 
              style={{...styles.filterBtn, ...(activeFilter === 'active' && styles.filterBtnInactive)}}
              onClick={() => setActiveFilter('active')}
            >
              Active
            </button>
          </div>

          {/* Projects List */}
          <div style={styles.projectsList}>
            {projects.map((project, index) => (
              <div key={index} style={styles.projectCard}>
                <div style={styles.projectHeader}>
                  <div style={styles.projectLeft}>
                    <div style={styles.projectAvatar}>
                      <Image src="/assets/logo-icon.png" alt={project.company} width={50} height={50} style={{borderRadius: '50%', objectFit: 'cover'}} />
                    </div>
                    <div>
                      <h3 style={styles.projectCompany}>{project.company}</h3>
                      <div style={styles.verticalLine}></div>
                      <h4 style={styles.projectTitle}>{project.title}</h4>
                    </div>
                  </div>
                  <div style={{...styles.statusBadge, background: project.statusColor}}>
                    {project.status}
                  </div>
                </div>

                <div style={styles.progressSection}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>Progress</span>
                    <span style={styles.progressValue}>{project.progress}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${project.progress}%`}}></div>
                  </div>
                </div>

                <div style={styles.projectDetails}>
                  <div style={styles.detailColumn}>
                    <p style={styles.detailLabel}>Budget</p>
                    <p style={styles.detailValue}>{project.budget}</p>
                  </div>
                  <div style={styles.detailColumn}>
                    <p style={styles.detailLabel}>Engagement</p>
                    <p style={styles.detailValue}>{project.engagement}</p>
                  </div>
                  <div style={styles.detailColumn}>
                    <p style={styles.detailLabel}>Deadline</p>
                    <p style={styles.detailValue}>{project.deadline}</p>
                  </div>
                  <div style={styles.detailColumn}>
                    <p style={styles.detailLabel}>Deliverables</p>
                    <p style={styles.detailValue}>{project.deliverables}</p>
                  </div>
                </div>

                <div style={styles.projectTags}>
                  <span style={styles.tag}>{project.stories} IG Stories</span>
                  <span style={styles.tag}>{project.reels} IG Reels</span>
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
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '35px',
  },
  userAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  userName: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#111',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '35px',
  },
  statCard: {
    borderRadius: '20px',
    padding: '25px',
    position: 'relative',
  },
  statIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '15px',
  },
  iconCircle: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '5px',
  },
  statLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  filterButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '25px',
  },
  filterBtn: {
    padding: '10px 22px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    background: '#e357a3',
    color: 'white',
  },
  filterBtnInactive: {
    background: '#f0f2f5',
    color: '#666',
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  projectCard: {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '20px',
    padding: '28px',
  },
  projectHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  projectLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  projectAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  verticalLine: {
    width: '2px',
    height: '20px',
    background: '#e0e0e0',
    margin: '0 0',
  },
  projectCompany: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#111',
  },
  projectTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '500',
    color: '#666',
  },
  statusBadge: {
    padding: '8px 18px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'white',
  },
  progressSection: {
    marginBottom: '20px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: '14px',
    color: '#111',
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e8e8e8',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#4371f0',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  projectDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  },
  detailColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
    marginBottom: '6px',
  },
  detailValue: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#111',
  },
  projectTags: {
    display: 'flex',
    gap: '10px',
  },
  tag: {
    padding: '6px 14px',
    background: '#f0f2f5',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
  },
};