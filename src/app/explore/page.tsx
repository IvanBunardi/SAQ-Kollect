'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type KOL = {
  id: string;
  name: string;
  username: string;
  category: string;
  profilePhoto: string | null;
};

type Company = {
  id: string;
  name: string;
  username: string;
  category: string;
  profilePhoto: string | null;
};

type FeedPost = {
  id: string;
  caption: string;
  mediaUrl: string | null;
  mediaType: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user: {
    id: string;
    fullname: string;
    username: string;
    profilePhoto: string | null;
  };
};

export default function ExplorePage() {
  const [activeNav, setActiveNav] = useState('explore');
  const [trendingKols, setTrendingKols] = useState<KOL[]>([]);
  const [trendingCompanies, setTrendingCompanies] = useState<Company[]>([]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = async () => {
    try {
      setLoading(true);

      const [kolsRes, companiesRes, feedRes] = await Promise.all([
        fetch('/api/explore/trending-kols'),
        fetch('/api/explore/trending-companies'),
        fetch('/api/explore/feed?limit=6'),
      ]);

      const kolsData = await kolsRes.json();
      const companiesData = await companiesRes.json();
      const feedData = await feedRes.json();

      console.log('🎯 KOLs Data from API:', kolsData);
      console.log('🎯 Companies Data from API:', companiesData);
      console.log('🎯 Feed Data from API:', feedData);

      if (kolsData.success) {
        console.log('✅ Setting KOLs:', kolsData.kols);
        setTrendingKols(kolsData.kols);
      }

      if (companiesData.success) {
        console.log('✅ Setting Companies:', companiesData.companies);
        setTrendingCompanies(companiesData.companies);
      }

      if (feedData.success) {
        setFeedPosts(feedData.posts);
      }

    } catch (error) {
      console.error('❌ Error fetching explore data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (username: string) => {
    console.log('🔗 Navigating to profile:', username);
    console.log('🔍 Full URL will be:', `/profile/${username}`);
    router.push(`/profile/${username}`);
  };

  const getColorForIndex = (index: number) => {
    const colors = ['#e8b4d4', '#e357a3', '#a5c8f0', '#c8ddf0'];
    return colors[index % colors.length];
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .profile-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .feed-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Background circles */}
      <div style={styles.circles}>
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, top: '-180px', left: '-180px', animationDelay: '0s'}}></div>
        <div style={{...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-120px', left: '120px', animationDelay: '2s'}}></div>
        <div style={{...styles.circle, ...styles.lightblue, ...styles.big, top: '50px', left: '150px', animationDelay: '1s'}}></div>
        <div style={{...styles.circle, ...styles.verylightblue, ...styles.medium, top: '10px', left: '90px', animationDelay: '3s'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.small, top: '120px', left: '20px', animationDelay: '4s'}}></div>
        
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
            <Link href="/explore" style={{...styles.navItem, ...(activeNav === 'explore' && styles.navItemActive)}}>
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
            <Link href="/profile/me" style={styles.navItem}>
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
            <Link href="/settings" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
              </svg>
              <span>Settings</span>
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
          <h1 style={styles.pageTitle}>Explore</h1>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f0f0f0',
                borderTop: '5px solid #4371f0',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p>Loading explore content...</p>
            </div>
          ) : (
            <>
              {/* Trending KOL's Section */}
              <h2 style={styles.sectionTitle}>Trending KOL's</h2>
              <div style={styles.cardGrid}>
                {trendingKols.length > 0 ? (
                  trendingKols.slice(0, 4).map((kol, index) => {
                    console.log('🎨 Rendering KOL card:', kol);
                    return (
                      <div 
                        key={kol.id} 
                        className="profile-card"
                        style={{...styles.card, background: getColorForIndex(index), cursor: 'pointer'}}
                        onClick={() => {
                          console.log('👆 Clicked KOL card:', {
                            id: kol.id,
                            name: kol.name,
                            username: kol.username,
                            category: kol.category
                          });
                          handleProfileClick(kol.username);
                        }}
                      >
                        <div style={styles.cardCircle}>
                          {kol.profilePhoto ? (
                            <img 
                              src={kol.profilePhoto} 
                              alt={kol.name}
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Image 
                              src="/assets/fotopp.png" 
                              alt={kol.name}
                              width={90}
                              height={90}
                              style={{ borderRadius: '50%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div style={styles.cardInfo}>
                          <p style={styles.cardName}>{kol.name}</p>
                          <p style={styles.cardCategory}>{kol.category}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', margin: '5px 0 0 0' }}>
                            @{kol.username}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '40px' }}>
                    No trending KOLs available
                  </p>
                )}
              </div>

              {/* Trending Companies Section */}
              <h2 style={styles.sectionTitle}>Trending Companies</h2>
              <div style={styles.cardGrid}>
                {trendingCompanies.length > 0 ? (
                  trendingCompanies.slice(0, 4).map((company, index) => {
                    console.log('🎨 Rendering Company card:', company);
                    return (
                      <div 
                        key={company.id} 
                        className="profile-card"
                        style={{...styles.card, background: getColorForIndex(index), cursor: 'pointer'}}
                        onClick={() => {
                          console.log('👆 Clicked Company card:', {
                            id: company.id,
                            name: company.name,
                            username: company.username,
                            category: company.category
                          });
                          handleProfileClick(company.username);
                        }}
                      >
                        <div style={styles.cardCircle}>
                          {company.profilePhoto ? (
                            <img 
                              src={company.profilePhoto} 
                              alt={company.name}
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Image 
                              src="/assets/fotopp.png" 
                              alt={company.name}
                              width={90}
                              height={90}
                              style={{ borderRadius: '50%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div style={styles.cardInfo}>
                          <p style={styles.cardName}>{company.name}</p>
                          <p style={styles.cardCategory}>{company.category}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', margin: '5px 0 0 0' }}>
                            @{company.username}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '40px' }}>
                    No trending companies available
                  </p>
                )}
              </div>

              {/* Feed Grid */}
              {feedPosts.length > 0 && (
                <div style={styles.feedGrid}>
                  {feedPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="feed-card"
                      style={{...styles.feedCard, background: 'linear-gradient(135deg, #a5c8f0, #c8ddf0)'}}
                    >
                      <div style={styles.feedHeader}>
                        <div 
                          style={{...styles.userAvatar, cursor: 'pointer'}}
                          onClick={() => handleProfileClick(post.user.username)}
                        >
                          {post.user.profilePhoto ? (
                            <img 
                              src={post.user.profilePhoto} 
                              alt={post.user.fullname}
                              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Image 
                              src="/assets/fotopp.png" 
                              alt="User" 
                              width={50} 
                              height={50} 
                              style={{borderRadius: '50%', objectFit: 'cover'}} 
                            />
                          )}
                        </div>
                        <div style={styles.userInfo}>
                          <h3 
                            style={{...styles.userName, cursor: 'pointer'}}
                            onClick={() => handleProfileClick(post.user.username)}
                          >
                            {post.user.fullname}
                          </h3>
                          <p style={styles.userTime}>{formatTimeAgo(post.createdAt)}</p>
                        </div>
                      </div>

                      <p style={styles.feedText}>{post.caption || 'No caption'}</p>

                      {post.mediaUrl && (
                        <div style={styles.feedImages}>
                          <div style={styles.feedImage}>
                            <img 
                              src={post.mediaUrl} 
                              alt="Post media"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }}
                            />
                          </div>
                        </div>
                      )}

                      <div style={styles.feedActions}>
                        <div style={styles.actionButtons}>
                          <button style={styles.actionBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span style={{ fontSize: '14px', marginLeft: '4px' }}>{post.likesCount}</span>
                          </button>
                          <button style={styles.actionBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <span style={{ fontSize: '14px', marginLeft: '4px' }}>{post.commentsCount}</span>
                          </button>
                          <button style={styles.actionBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
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
  medium: { width: '140px', height: '140px' },
  small: { width: '90px', height: '90px' },
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
  pageTitle: {
    fontSize: '38px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '35px',
    marginLeft: '0px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '20px',
    marginTop: '35px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '18px',
    marginBottom: '25px',
  },
  card: {
    borderRadius: '20px',
    padding: '25px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  cardCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'white',
    marginBottom: '15px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    textAlign: 'center',
  },
  cardName: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '3px',
  },
  cardCategory: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255,255,255,0.9)',
  },
  feedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '25px',
    marginTop: '35px',
    paddingBottom: '50px',
  },
  feedCard: {
    borderRadius: '24px',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
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
    overflow: 'hidden',
    flexShrink: 0,
  },
  userInfo: {},
  userName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '2px',
    transition: 'color 0.2s ease',
  },
  userTime: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  },
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
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#666',
  },
};