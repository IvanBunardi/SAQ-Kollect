'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
    profilePhoto?: string;
  };
  type: string;
  caption: string;
  mediaUrl: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  isLikedByUser: boolean;
  isSavedByUser: boolean;
  createdAt: string;
}

export default function Feeds() {
  const [activeNav, setActiveNav] = useState('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('📡 Fetching posts...');
      
      const res = await fetch('/api/post/feeds?page=1&limit=20', {
        method: 'GET',
        credentials: 'include', // PENTING: Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        console.error('❌ Failed to load posts:', data.message);
        setError(data.message || 'Failed to load posts');
        setLoading(false);
        return;
      }

      console.log('✅ Posts loaded:', data.posts.length, 'posts');
      setPosts(data.posts || []);
      setLoading(false);
    } catch (err) {
      console.error('❌ Network error:', err);
      setError('Network error');
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
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
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px'}}>
            <h1 style={styles.pageTitle}>Feeds</h1>
            <button 
              onClick={fetchPosts} 
              style={{
                padding: '10px 20px',
                background: '#4371f0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              🔄 Refresh
            </button>
          </div>
          
          {loading ? (
            <div style={styles.loadingBox}>Loading posts...</div>
          ) : error ? (
            <div style={styles.errorBox}>
              <p>{error}</p>
              <button 
                onClick={fetchPosts}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#4371f0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={{fontSize: '18px', color: '#666', marginBottom: '10px'}}>No posts yet. Create your first post!</p>
              <Link href="/create" style={styles.createLink}>Create Post</Link>
            </div>
          ) : (
            <div style={styles.feedGrid}>
              {posts.map((post) => (
                <div key={post._id} style={{...styles.feedCard, background: 'linear-gradient(135deg, #a5c8f0, #c8ddf0)'}}>
                  <div style={styles.feedHeader}>
                    <div style={styles.userAvatar}>
                      {post.user?.profilePhoto ? (
                        <img src={post.user.profilePhoto} alt={post.user.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
                          {post.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div style={styles.userInfo}>
                      <Link 
                        href={`/profile/${post.user?.username}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>
                          {post.user?.name}
                        </h3>
                        <p style={{margin: 0, fontSize: '13px', color: '#666'}}>
                          @{post.user?.username} • {formatTimeAgo(post.createdAt)}
                        </p>
                      </Link>
                    </div>

                  </div>
                  
                  {post.caption && (
                    <div style={styles.feedText}>
                      {post.caption}
                    </div>
                  )}
                  
                  <div style={styles.feedImages}>
                    <div style={styles.feedImage}>
                      <img src={post.mediaUrl} alt="Post" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px'}} />
                    </div>
                  </div>
                  
                  {post.location && (
                    <div style={styles.locationTag}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{post.location}</span>
                    </div>
                  )}
                  
                  <div style={styles.feedActions}>
                    <div style={styles.actionButtons}>
                      <button style={styles.actionBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={post.isLikedByUser ? '#e74c3c' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span style={{fontSize: '13px', marginLeft: '4px'}}>{post.likesCount}</span>
                      </button>
                      <button style={styles.actionBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span style={{fontSize: '13px', marginLeft: '4px'}}>{post.commentsCount}</span>
                      </button>
                      <button style={styles.actionBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={post.isSavedByUser ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>
                    </div>
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
    margin: 0,
  },
  loadingBox: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#666',
  },
  errorBox: {
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '12px',
    padding: '20px',
    color: '#c33',
    fontSize: '16px',
    textAlign: 'center',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '80px 40px',
    background: '#f9f9f9',
    borderRadius: '16px',
  },
  createLink: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 32px',
    background: '#4371f0',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
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
    marginBottom: '12px',
  },
  feedImage: {
    flex: 1,
    height: '300px',
    borderRadius: '18px',
    background: '#f0f0f0',
    overflow: 'hidden',
  },
  locationTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px',
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
    padding: '8px 14px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#666',
    fontSize: '14px',
  },
};