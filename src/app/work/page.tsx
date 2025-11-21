'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Deliverable {
  type: string;
  title: string;
  required: number;
  submitted: number;
}

interface Work {
  _id: string;
  title: string;
  brand: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  status: string;
  progress: number;
  budget: number;
  earnings: number;
  deadline: string;
  deliverables: Deliverable[];
  engagementTarget: number;
  actualEngagement: number;
}

interface Stats {
  activeProjects: number;
  totalEarnings: number;
  avgEngagement: number;
  thisMonthProjects: number;
}

export default function WorkPage() {
  const [activeNav, setActiveNav] = useState('work');
  const [activeFilter, setActiveFilter] = useState('all');
  const [works, setWorks] = useState<Work[]>([]);
  const [stats, setStats] = useState<Stats>({
    activeProjects: 0,
    totalEarnings: 0,
    avgEngagement: 0,
    thisMonthProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
    fetchStats();
    fetchWorks();
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [activeFilter]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserData(data.user);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/work/stats', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/work?status=${activeFilter}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setWorks(data.works);
      }
    } catch (err) {
      console.error('Error fetching works:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$ ${(amount / 1000000).toFixed(1)} M`;
    if (amount >= 1000) return `$ ${(amount / 1000).toFixed(1)} K`;
    return `$ ${amount}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#90ee90';
      case 'completed': case 'paid': return '#b3d9ff';
      case 'in_review': return '#f4c2f0';
      case 'revision': return '#ffcc80';
      case 'pending': return '#e0e0e0';
      case 'cancelled': return '#ffcdd2';
      default: return '#e0e0e0';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'paid': return 'Paid';
      case 'in_review': return 'In Review';
      case 'revision': return 'Revision';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getDeliverableLabel = (type: string) => {
    switch (type) {
      case 'ig_story': return 'IG Stories';
      case 'ig_reel': return 'IG Reels';
      case 'ig_post': return 'IG Posts';
      case 'tiktok': return 'TikTok';
      case 'youtube': return 'YouTube';
      case 'twitter': return 'Twitter';
      default: return type;
    }
  };

  const getAvatarUrl = (profilePhoto?: string, name?: string) => {
    if (profilePhoto && profilePhoto.trim() !== '') return profilePhoto;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Brand')}&background=random&size=60&bold=true`;
  };

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

      {/* Background circles */}
      <div style={styles.circles}>
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, top: '-180px', left: '-180px'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-120px', left: '120px'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.big, top: '50px', left: '150px'}}></div>
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, bottom: '-150px', left: '-120px'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-80px', left: '180px'}}></div>
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, top: '-160px', right: '-160px'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-100px', right: '140px'}}></div>
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, bottom: '-140px', right: '-120px'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-60px', right: '160px'}}></div>
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
            <Link href="/work" style={{...styles.navItem, ...styles.navItemActive}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
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
          
          <div style={styles.sidebarDecoration}>
            <div style={{...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0'}}></div>
            <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3'}}></div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* User Header */}
          <div style={styles.userHeader}>
            <div style={styles.userAvatar}>
              <img 
                src={getAvatarUrl(userData?.profilePhoto, userData?.fullname)}
                alt="User" 
                style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} 
              />
            </div>
            <h1 style={styles.userName}>{userData?.fullname || userData?.username || 'Loading...'}</h1>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsContainer}>
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #e8eaf6, #f0f2f5)'}}>
              <div style={styles.statContent}>
                <div>
                  <p style={styles.statLabel}>Active Projects</p>
                  <h2 style={styles.statValue}>{stats.activeProjects}</h2>
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
                  <h2 style={styles.statValue}>{formatCurrency(stats.totalEarnings)}</h2>
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
                  <h2 style={styles.statValue}>{formatNumber(stats.avgEngagement)}</h2>
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
                  <h2 style={styles.statValue}>{stats.thisMonthProjects}</h2>
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
              style={{...styles.filterBtn, ...(activeFilter === 'all' ? styles.filterBtnActive : styles.filterBtnInactive)}}
              onClick={() => setActiveFilter('all')}
            >
              All Projects
            </button>
            <button 
              style={{...styles.filterBtn, ...(activeFilter === 'active' ? styles.filterBtnActive : styles.filterBtnInactive)}}
              onClick={() => setActiveFilter('active')}
            >
              Active
            </button>
            <button 
              style={{...styles.filterBtn, ...(activeFilter === 'completed' ? styles.filterBtnActive : styles.filterBtnInactive)}}
              onClick={() => setActiveFilter('completed')}
            >
              Completed
            </button>
          </div>

          {/* Projects List */}
          {loading ? (
            <div style={{textAlign: 'center', padding: '60px', color: '#666'}}>Loading projects...</div>
          ) : works.length === 0 ? (
            <div style={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <h3>No projects yet</h3>
              <p>When brands hire you for campaigns, they'll appear here.</p>
              <Link href="/explore" style={styles.exploreBtn}>Explore Campaigns</Link>
            </div>
          ) : (
            <div style={styles.projectsList}>
              {works.map((work) => (
                <div key={work._id} style={styles.projectCard}>
                  <div style={styles.projectHeader}>
                    <div style={styles.projectLeft}>
                      <div style={styles.projectAvatar}>
                        <img 
                          src={getAvatarUrl(work.brand.profilePhoto, work.brand.name)}
                          alt={work.brand.name} 
                          style={{width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover'}} 
                        />
                      </div>
                      <div style={styles.projectInfo}>
                        <h3 style={styles.projectCompany}>{work.brand.name}</h3>
                        <div style={styles.divider}>|</div>
                        <h4 style={styles.projectTitle}>{work.title}</h4>
                      </div>
                    </div>
                    <div style={{...styles.statusBadge, background: getStatusColor(work.status)}}>
                      {getStatusLabel(work.status)}
                    </div>
                  </div>

                  <div style={styles.progressSection}>
                    <div style={styles.progressHeader}>
                      <span style={styles.progressLabel}>Progress</span>
                      <span style={styles.progressValue}>{work.progress}%</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{...styles.progressFill, width: `${work.progress}%`}}></div>
                    </div>
                  </div>

                  <div style={styles.projectDetails}>
                    <div style={styles.detailColumn}>
                      <p style={styles.detailLabel}>Budget</p>
                      <p style={styles.detailValue}>{formatCurrency(work.budget)}</p>
                    </div>
                    <div style={styles.detailColumn}>
                      <p style={styles.detailLabel}>Engagement</p>
                      <p style={styles.detailValue}>{formatNumber(work.engagementTarget)}</p>
                    </div>
                    <div style={styles.detailColumn}>
                      <p style={styles.detailLabel}>Deadline</p>
                      <p style={styles.detailValue}>{formatDate(work.deadline)}</p>
                    </div>
                    <div style={styles.detailColumn}>
                      <p style={styles.detailLabel}>Deliverables</p>
                      <p style={styles.detailValue}>{work.deliverables.length}</p>
                    </div>
                  </div>

                  <div style={styles.projectTags}>
                    {work.deliverables.map((d, i) => (
                      <span key={i} style={styles.tag}>
                        {d.submitted}/{d.required} {getDeliverableLabel(d.type)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
  container: { display: 'flex', minHeight: '100vh', background: 'white' },
  sidebar: {
    width: '260px', background: '#fafbfc', position: 'fixed', height: '100vh',
    left: 0, top: 0, zIndex: 100, padding: '30px 20px', display: 'flex',
    flexDirection: 'column', borderRight: '1px solid #e8e8e8',
  },
  logo: { marginBottom: '50px', paddingLeft: '10px' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
    borderRadius: '12px', color: '#666', textDecoration: 'none', fontSize: '15px',
    fontWeight: '500', background: '#e8eaed', transition: 'all 0.2s ease', cursor: 'pointer',
  },
  navItemActive: { background: '#4371f0', color: 'white' },
  sidebarDecoration: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', overflow: 'hidden', pointerEvents: 'none' },
  sidebarCircle: { position: 'absolute', borderRadius: '50%', opacity: 0.5, animation: 'float 12s infinite ease-in-out' },
  mainContent: { flex: 1, marginLeft: '260px', padding: '30px 50px', zIndex: 10 },
  userHeader: { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '30px' },
  userAvatar: { width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 },
  userName: { margin: 0, fontSize: '26px', fontWeight: '700', color: '#111' },
  statsContainer: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
  statCard: { borderRadius: '16px', padding: '20px 25px' },
  statContent: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { margin: 0, fontSize: '15px', color: '#111', fontWeight: '600', marginBottom: '8px' },
  statValue: { margin: 0, fontSize: '36px', fontWeight: '700', color: '#111' },
  statIconBox: { width: '65px', height: '65px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  filterButtons: { display: 'flex', gap: '12px', marginBottom: '25px' },
  filterBtn: { padding: '10px 24px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  filterBtnActive: { background: '#e357a3', color: 'white' },
  filterBtnInactive: { background: '#e8eaed', color: '#666' },
  emptyState: { textAlign: 'center', padding: '80px 40px', background: '#f9f9f9', borderRadius: '16px' },
  exploreBtn: {
    display: 'inline-block', marginTop: '20px', padding: '12px 32px',
    background: '#4371f0', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600',
  },
  projectsList: { display: 'flex', flexDirection: 'column', gap: '18px' },
  projectCard: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '24px' },
  projectHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' },
  projectLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  projectAvatar: { width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 },
  projectInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  projectCompany: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#111' },
  divider: { fontSize: '15px', color: '#ccc', fontWeight: '300' },
  projectTitle: { margin: 0, fontSize: '15px', fontWeight: '400', color: '#111' },
  statusBadge: { padding: '6px 16px', borderRadius: '16px', fontSize: '12px', fontWeight: '600', color: '#333' },
  progressSection: { marginBottom: '18px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  progressLabel: { fontSize: '13px', color: '#111', fontWeight: '600' },
  progressValue: { fontSize: '13px', color: '#111', fontWeight: '700' },
  progressBar: { width: '100%', height: '10px', background: '#e8e8e8', borderRadius: '10px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#4371f0', borderRadius: '10px', transition: 'width 0.3s ease' },
  projectDetails: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '16px' },
  detailColumn: { display: 'flex', flexDirection: 'column' },
  detailLabel: { margin: 0, fontSize: '12px', color: '#111', marginBottom: '4px', fontWeight: '600' },
  detailValue: { margin: 0, fontSize: '13px', fontWeight: '700', color: '#111' },
  projectTags: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: { padding: '6px 12px', background: '#e8eaed', borderRadius: '6px', fontSize: '12px', color: '#666', fontWeight: '500' },
};