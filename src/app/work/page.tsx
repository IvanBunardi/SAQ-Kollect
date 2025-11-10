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
      budget: '$ 1,000',
      engagement: '50 K',
      deadline: '2025 - 10 - 20',
      deliverables: '2',
      stories: 2,
      reels: 3,
      status: 'Active',
      statusColor: '#90ee90'
    },
    {
      company: 'MJ Toys',
      title: 'Product Launch Campaign',
      progress: 100,
      budget: '$ 1,000',
      engagement: '50 K',
      deadline: '2025 - 10 - 20',
      deliverables: '2',
      stories: 2,
      reels: 3,
      status: 'Done',
      statusColor: '#b3d9ff'
    },
    {
      company: 'MJ Toys',
      title: 'Product Launch Campaign',
      progress: 100,
      budget: '$ 1,000',
      engagement: '50 K',
      deadline: '2025 - 10 - 20',
      deliverables: '2',
      stories: 2,
      reels: 3,
      status: 'In Check',
      statusColor: '#f4c2f0'
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
            <Link href="/work" style={{...styles.navItem, ...(activeNav === 'work' && styles.navItemActive)}}>
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
          {/* User Header */}
          <div style={styles.userHeader}>
            <div style={styles.userAvatar}>
              <Image src="/assets/fotomes.png" alt="User" width={60} height={60} style={{borderRadius: '50%', objectFit: 'cover'}} />
            </div>
            <h1 style={styles.userName}>Felix Tan</h1>
          </div>

          {/* Stats Cards - Vertical Layout */}
          <div style={styles.statsContainer}>
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #e8eaf6, #f0f2f5)'}}>
              <div style={styles.statContent}>
                <div>
                  <p style={styles.statLabel}>Active Project</p>
                  <h2 style={styles.statValue}>2</h2>
                </div>
                <div style={{...styles.statIconBox, background: '#f4c2f0'}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5a8a" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
              </div>
            </div>

            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #e8f5e9, #f0f2f5)'}}>
              <div style={styles.statContent}>
                <div>
                  <p style={styles.statLabel}>Total Earnings</p>
                  <h2 style={styles.statValue}>$ 10 K</h2>
                </div>
                <div style={{...styles.statIconBox, background: '#c8e6c9'}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a7c4a" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
              </div>
            </div>

            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #e3f2fd, #f0f2f5)'}}>
              <div style={styles.statContent}>
                <div>
                  <p style={styles.statLabel}>Avg. Engagement</p>
                  <h2 style={styles.statValue}>10.5 K</h2>
                </div>
                <div style={{...styles.statIconBox, background: '#b3d9ff'}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a6fa5" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </div>
            </div>

            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f3e5f5, #f0f2f5)'}}>
              <div style={styles.statContent}>
                <div>
                  <p style={styles.statLabel}>This Month</p>
                  <h2 style={styles.statValue}>5</h2>
                </div>
                <div style={{...styles.statIconBox, background: '#f4c2f0'}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5a8a" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </div>
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
                      <Image src="/assets/logo-icon.png" alt={project.company} width={45} height={45} style={{borderRadius: '50%', objectFit: 'cover'}} />
                    </div>
                    <div style={styles.projectInfo}>
                      <h3 style={styles.projectCompany}>{project.company}</h3>
                      <div style={styles.divider}>|</div>
                      <h4 style={styles.projectTitle}>{project.title}</h4>
                    </div>
                  </div>
                  <div style={{...styles.statusBadge, background: project.statusColor, color: '#333'}}>
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
    padding: '30px 50px',
    zIndex: 10,
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '30px',
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
    fontSize: '26px',
    fontWeight: '700',
    color: '#111',
  },
  
  // NEW: Vertical Stats Layout
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    borderRadius: '16px',
    padding: '20px 25px',
  },
  statContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    margin: 0,
    fontSize: '15px',
    color: '#111',
    fontWeight: '600',
    marginBottom: '8px',
  },
  statValue: {
    margin: 0,
    fontSize: '36px',
    fontWeight: '700',
    color: '#111',
  },
  statIconBox: {
    width: '65px',
    height: '65px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  filterButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '25px',
  },
  filterBtn: {
    padding: '10px 24px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    background: '#e357a3',
    color: 'white',
  },
  filterBtnInactive: {
    background: '#e8eaed',
    color: '#666',
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  projectCard: {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    padding: '24px',
  },
  projectHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  projectLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  projectAvatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  projectInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  projectCompany: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#111',
  },
  divider: {
    fontSize: '15px',
    color: '#ccc',
    fontWeight: '300',
  },
  projectTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '400',
    color: '#111',
  },
  statusBadge: {
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: '18px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '13px',
    color: '#111',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: '13px',
    color: '#111',
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    height: '10px',
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
    gap: '15px',
    marginBottom: '16px',
  },
  detailColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    margin: 0,
    fontSize: '12px',
    color: '#111',
    marginBottom: '4px',
    fontWeight: '600',
  },
  detailValue: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '700',
    color: '#111',
  },
  projectTags: {
    display: 'flex',
    gap: '8px',
  },
  tag: {
    padding: '6px 12px',
    background: '#e8eaed',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#666',
    fontWeight: '500',
  },
};