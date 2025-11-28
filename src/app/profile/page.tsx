'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
  _id: string;
  user: {
    _id: string;
    name?: string;
    username: string;
    profilePhoto?: string;
    profilePicture?: string;
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

interface Metrics {
  avgEngagementRate: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  totalReach: number;
  totalLikes: number;
  totalComments: number;
  totalSaves: number;
  totalPosts: number;
  postFrequency: number;
  followersCount: number;
  bestPerformingPost: any;
}

export default function ProfilePage() {
  const [activeNav, setActiveNav] = useState('profile');
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullname: '',
    username: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  const [metrics, setMetrics] = useState<Metrics>({
    avgEngagementRate: 0,
    avgLikesPerPost: 0,
    avgCommentsPerPost: 0,
    totalReach: 0,
    totalLikes: 0,
    totalComments: 0,
    totalSaves: 0,
    totalPosts: 0,
    postFrequency: 0,
    followersCount: 0,
    bestPerformingPost: null
  });
  const [metricsLoading, setMetricsLoading] = useState(true);
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userData?.username) {
      fetchUserPosts();
      fetchMetrics();
    }
  }, [userData]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        setUserData(data.user);
        setFollowersCount(data.user.followersCount || 0);
        setFollowingCount(data.user.followingCount || 0);
        setEditFormData({
          fullname: data.user.fullname || '',
          username: data.user.username || '',
        });
      } else {
        setError(data.message || 'Failed to load profile');
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`/api/post/user/${userData.username}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        setPosts([]);
      }
      setPostsLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPostsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setMetricsLoading(true);
      const res = await fetch('/api/profile/metrics', {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
          console.log('📊 Metrics loaded:', data.metrics);
        }
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      fullname: userData?.fullname || '',
      username: userData?.username || '',
    });
    setSaveError('');
    setSaveSuccess('');
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile', { 
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (data.success && data.user) {
        setUserData(data.user);
        setIsEditing(false);
        setSaveSuccess('Profile updated successfully!');
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setSaveError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setSaveError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const getAvatarUrl = (profilePhoto?: string, profilePicture?: string, fallbackName?: string) => {
    if (profilePhoto && profilePhoto.trim() !== '') return profilePhoto;
    if (profilePicture && profilePicture.trim() !== '') return profilePicture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'User')}&background=random&size=150&bold=true`;
  };

  const selectedPost = selectedPostId ? posts.find(p => p._id === selectedPostId) : null;

  const handlePostComment = async () => {
    if (!commentText.trim() || !selectedPost) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/post/${selectedPost._id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (res.ok) {
        setCommentText('');
        // Refresh posts to show updated comment count
        fetchUserPosts();
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.btnPrimary} onClick={() => router.push('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          66% { transform: translateY(15px) translateX(-10px) rotate(-3deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        body { margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>

      {/* ✅ MODAL */}
      {selectedPost && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setSelectedPostId(null)}
        >
          <div style={{
            background: 'white', borderRadius: '20px', maxWidth: '900px',
            width: '90%', maxHeight: '80vh', overflow: 'auto',
            display: 'grid', gridTemplateColumns: '1fr 400px',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Media */}
            <div style={{
              background: '#000', display: 'flex', alignItems: 'center',
              justifyContent: 'center', minHeight: '500px'
            }}>
              {selectedPost.type === 'video' ? (
                <video src={selectedPost.mediaUrl} style={{
                  maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'
                }} controls autoPlay />
              ) : (
                <img src={selectedPost.mediaUrl} alt="Post" style={{
                  maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'
                }} />
              )}
            </div>

            {/* Details Sidebar */}
            <div style={{
              padding: '24px', display: 'flex', flexDirection: 'column',
              background: '#f9f9f9', overflow: 'auto'
            }}>
              {/* Close Button */}
              <button style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'white', border: 'none', width: '36px', height: '36px',
                borderRadius: '50%', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1001,
                fontSize: '20px', fontWeight: 'bold'
              }}
              onClick={() => setSelectedPostId(null)}
              >
                ✕
              </button>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', marginTop: '10px' }}>
                <img src={getAvatarUrl(selectedPost.user.profilePhoto, selectedPost.user.profilePicture, selectedPost.user.name)}
                  alt="User" style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#111' }}>
                    {selectedPost.user.name || selectedPost.user.username}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                    @{selectedPost.user.username}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <p style={{
                fontSize: '15px', color: '#333', marginBottom: '16px',
                lineHeight: '1.5', borderBottom: '1px solid #e0e0e0',
                paddingBottom: '16px'
              }}>
                {selectedPost.caption}
              </p>

              {/* Location */}
              {selectedPost.location && (
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                  📍 {selectedPost.location}
                </p>
              )}

              {/* Stats */}
              <div style={{
                display: 'flex', gap: '16px', padding: '16px 0',
                borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0'
              }}>
                <span style={{ fontSize: '14px', color: '#333' }}>
                  <strong>❤️ {selectedPost.likesCount}</strong> likes
                </span>
                <span style={{ fontSize: '14px', color: '#333' }}>
                  <strong>💬 {selectedPost.commentsCount}</strong> comments
                </span>
                <span style={{ fontSize: '14px', color: '#333' }}>
                  <strong>🔖 {selectedPost.savesCount}</strong> saves
                </span>
              </div>

              {/* Date */}
              <p style={{
                fontSize: '12px', color: '#999', marginTop: '16px'
              }}>
                {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>

              {/* Comments Section */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0', flex: 1, overflow: 'auto' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Comments</h3>
                <div style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '20px' }}>
                  💬 Comments coming soon!
                </div>
              </div>

              {/* Comment Input */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
                <textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: '100%', padding: '12px', border: '1px solid #e0e0e0',
                    borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit',
                    boxSizing: 'border-box', resize: 'none'
                  }}
                  rows={2}
                />
                <button 
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                  style={{
                    width: '100%', marginTop: '8px', padding: '10px',
                    background: commentText.trim() ? '#e357a3' : '#ddd', 
                    color: 'white', border: 'none',
                    borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                    cursor: commentText.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <Link href="/profile" style={{...styles.navItem, ...styles.navItemActive}}>
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
            <button onClick={handleLogout} style={{...styles.navItem, marginTop: 'auto'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Logout</span>
            </button>
          </nav>
          
          <div style={styles.sidebarDecoration}>
            <div style={{...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0'}}></div>
            <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3'}}></div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {saveSuccess && <div style={styles.successMessage}>{saveSuccess}</div>}
          {saveError && <div style={styles.errorMessage}>{saveError}</div>}

          {/* Profile Header */}
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatar}>
              <img 
                src={getAvatarUrl(userData?.profilePhoto, userData?.profilePicture, userData?.fullname || userData?.username)}
                alt="Profile" 
                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}}
                onError={(e: any) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.fullname || 'User')}&background=e357a3&color=fff&size=150&bold=true`;
                }}
              />
            </div>
            
            <div style={styles.profileInfo}>
              {!isEditing ? (
                <>
                  <h1 style={styles.profileUsername}>{userData?.username || 'Loading...'}</h1>
                  <h2 style={styles.profileTitle}>{userData?.role ? userData.role.toUpperCase() : 'USER'}</h2>
                  <p style={styles.profileCategory}>
                    {userData?.fullname || ''} • {userData?.email || ''}
                  </p>
                </>
              ) : (
                <div style={styles.editForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      value={editFormData.fullname}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
              )}
              
              <div style={styles.profileStats}>
                <span style={styles.stat}><strong>{followersCount}</strong> followers</span>
                <span style={styles.stat}><strong>{followingCount}</strong> following</span>
              </div>
              
              <p style={styles.profileBio}>
                {userData?.createdAt 
                  ? `Member since ${new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                  : ''}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            {!isEditing ? (
              <>
                <button style={styles.btnSecondary} onClick={handleEditClick}>Edit Profile</button>
                <button style={styles.btnSecondary} onClick={() => router.push('/settings')}>Settings</button>
                <button style={styles.btnPrimary} onClick={() => router.push('/hire-campaign')}>Hire for Campaign</button>
              </>
            ) : (
              <>
                <button style={{...styles.btnSecondary, opacity: saveLoading ? 0.6 : 1}} onClick={handleCancelEdit} disabled={saveLoading}>Cancel</button>
                <button style={{...styles.btnPrimary, opacity: saveLoading ? 0.6 : 1}} onClick={handleSaveProfile} disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <button 
              style={{...styles.tab, ...(activeTab === 'profile' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'work' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('work')}
            >
              Work
            </button>
          </div>

          {/* Content Grid */}
          <div style={styles.contentGrid}>
            {/* Recent Posts Card */}
            <div style={{...styles.card, background: 'linear-gradient(135deg, #a5c8f0, #c8ddf0)'}}>
              <div style={styles.cardHeader}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <h3 style={styles.cardTitle}>Recent Posts ({posts.length})</h3>
              </div>
              <div style={styles.cardContent}>
                {postsLoading ? (
                  <p style={{color: '#666'}}>Loading posts...</p>
                ) : posts.length === 0 ? (
                  <p style={{color: '#666'}}>No posts yet. Create your first post!</p>
                ) : (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                    {posts.slice(0, 6).map((post) => (
                      <div 
                        key={post._id} 
                        style={{
                          borderRadius: '12px', overflow: 'hidden', height: '120px', 
                          background: '#fff', cursor: 'pointer', position: 'relative'
                        }}
                        onClick={() => setSelectedPostId(post._id)}
                      >
                        {post.mediaUrl ? (
                          post.type === 'video' ? (
                            <video src={post.mediaUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
                          ) : (
                            <img src={post.mediaUrl} alt="Post" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          )
                        ) : (
                          <div style={{padding: '8px', fontSize: '12px', color: '#666'}}>{post.caption}</div>
                        )}
                        
                        {post.type === 'video' && (
                          <div style={{
                            position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)',
                            borderRadius: '50%', width: '24px', height: '24px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                              <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div style={{...styles.card, background: 'linear-gradient(135deg, #e357a3, #f4a3c8)'}}>
              <div style={styles.cardHeader}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <h3 style={styles.cardTitle}>Performance Metrics</h3>
                {metricsLoading && <span style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginLeft: '8px'}}>Loading...</span>}
              </div>
              <div style={styles.metricsGrid}>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>
                    {metrics.avgEngagementRate > 0 ? `${metrics.avgEngagementRate}%` : '0%'}
                  </p>
                  <p style={styles.metricLabel}>Engagement Rate</p>
                </div>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>{formatNumber(metrics.avgLikesPerPost)}</p>
                  <p style={styles.metricLabel}>Avg. Likes/Post</p>
                </div>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>{formatNumber(metrics.totalReach)}</p>
                  <p style={styles.metricLabel}>Total Reach</p>
                </div>
                <div style={styles.metricBox}>
                  <p style={styles.metricValue}>{metrics.postFrequency}/mo</p>
                  <p style={styles.metricLabel}>Post Frequency</p>
                </div>
              </div>
              
              <div style={{marginTop: '16px', display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px'}}>
                  <span style={{color: 'white', fontSize: '13px'}}>❤️ {formatNumber(metrics.totalLikes)} likes</span>
                </div>
                <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px'}}>
                  <span style={{color: 'white', fontSize: '13px'}}>💬 {formatNumber(metrics.totalComments)} comments</span>
                </div>
                <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px'}}>
                  <span style={{color: 'white', fontSize: '13px'}}>🔖 {formatNumber(metrics.totalSaves)} saves</span>
                </div>
              </div>
            </div>
          </div>

          {/* All Posts Grid */}
          <div style={{marginTop: '40px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '20px'}}>
              All Posts ({posts.length})
            </h2>

            {postsLoading ? (
              <div style={{textAlign: 'center', padding: '60px', fontSize: '18px', color: '#666'}}>
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div style={{textAlign: 'center', padding: '80px 40px', background: '#f9f9f9', borderRadius: '16px'}}>
                <p>No posts yet. Create your first post!</p>
                <button 
                  style={{
                    marginTop: '20px', padding: '12px 32px', background: '#4371f0',
                    color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer'
                  }}
                  onClick={() => router.push('/create')}
                >
                  Create Post
                </button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '40px'}}>
                {posts.map((post) => (
                  <div 
                    key={post._id}
                    style={{
                      width: '100%', height: '260px', borderRadius: '12px',
                      overflow: 'hidden', background: '#eee', cursor: 'pointer', position: 'relative'
                    }}
                    onClick={() => setSelectedPostId(post._id)}
                  >
                    {post.type === 'video' ? (
                      <video src={post.mediaUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
                    ) : (
                      <img src={post.mediaUrl} alt="Post" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    )}
                    
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '16px', opacity: 0, transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <span style={{color: 'white', fontSize: '16px', fontWeight: '600'}}>
                        ❤️ {post.likesCount}
                      </span>
                      <span style={{color: 'white', fontSize: '16px', fontWeight: '600'}}>
                        💬 {post.commentsCount}
                      </span>
                    </div>
                    
                    {post.type === 'video' && (
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '48px', height: '48px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  circles: { position: 'fixed' as const, width: '100%', height: '100%', overflow: 'hidden' as const, zIndex: -1 },
  circle: { position: 'absolute' as const, borderRadius: '50%', opacity: 1, animation: 'float 15s infinite ease-in-out' },
  pink: { background: '#e357a3' },
  lightpink: { background: '#f4a3c8' },
  blue: { background: '#4371f0' },
  lightblue: { background: '#a5c8f0' },
  huge: { width: '350px', height: '350px' },
  extrabig: { width: '280px', height: '280px' },
  big: { width: '200px', height: '200px' },
  container: { display: 'flex', minHeight: '100vh', background: 'white' },
  
  sidebar: {
    width: '260px', background: '#fafbfc', position: 'fixed' as const, height: '100vh',
    left: 0, top: 0, zIndex: 100, padding: '30px 20px', display: 'flex',
    flexDirection: 'column' as const, borderRight: '1px solid #e8e8e8'
  },
  logo: { marginBottom: '50px', paddingLeft: '10px' },
  navMenu: { display: 'flex', flexDirection: 'column' as const, gap: '4px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
    borderRadius: '12px', color: '#666', textDecoration: 'none', fontSize: '15px',
    fontWeight: '500' as const, background: '#e8eaed', transition: 'all 0.2s ease',
    cursor: 'pointer', border: 'none'
  },
  navItemActive: { background: '#4371f0', color: 'white' },
  sidebarDecoration: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: '200px', overflow: 'hidden' as const, pointerEvents: 'none' as const },
  sidebarCircle: { position: 'absolute' as const, borderRadius: '50%', opacity: 0.5, animation: 'float 12s infinite ease-in-out' },
  
  mainContent: { flex: 1, marginLeft: '260px', padding: '40px 60px', zIndex: 10 },
  
  successMessage: {
    background: '#d4edda', color: '#155724', padding: '14px 20px',
    borderRadius: '12px', marginBottom: '20px', fontSize: '15px', border: '1px solid #c3e6cb'
  },
  errorMessage: {
    background: '#f8d7da', color: '#721c24', padding: '14px 20px',
    borderRadius: '12px', marginBottom: '20px', fontSize: '15px', border: '1px solid #f5c6cb'
  },
  
  profileHeader: { display: 'flex', gap: '35px', marginBottom: '30px', alignItems: 'flex-start' as const },
  profileAvatar: {
    width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden' as const,
    flexShrink: 0, border: '4px solid #f0f0f0'
  },
  profileInfo: { flex: 1 },
  profileUsername: { margin: 0, fontSize: '32px', fontWeight: '700' as const, color: '#111', marginBottom: '5px' },
  profileTitle: { margin: 0, fontSize: '20px', fontWeight: '600' as const, color: '#e357a3', marginBottom: '8px' },
  profileCategory: { margin: 0, fontSize: '16px', color: '#666', marginBottom: '15px' },
  profileStats: { display: 'flex', gap: '25px', marginBottom: '15px' },
  stat: { fontSize: '15px', color: '#333' },
  profileBio: { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: 0 },
  
  editForm: { marginBottom: '20px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600' as const, color: '#111', marginBottom: '6px' },
  input: {
    width: '100%', padding: '12px 16px', border: '1.5px solid #e0e0e0',
    borderRadius: '10px', fontSize: '15px', color: '#333', outline: 'none',
    transition: 'border 0.2s', boxSizing: 'border-box' as const, background: '#f5f7fa'
  },
  
  actionButtons: { display: 'flex', gap: '15px', marginBottom: '35px' },
  btnSecondary: {
    padding: '12px 28px', background: '#f0f2f5', border: 'none',
    borderRadius: '12px', fontSize: '15px', fontWeight: '500' as const, color: '#333',
    cursor: 'pointer', transition: 'all 0.2s'
  },
  btnPrimary: {
    padding: '12px 28px', background: '#e357a3', border: 'none',
    borderRadius: '12px', fontSize: '15px', fontWeight: '500' as const, color: 'white',
    cursor: 'pointer', transition: 'all 0.2s'
  },
  
  tabsContainer: { display: 'flex', gap: '5px', marginBottom: '30px', borderBottom: '2px solid #f0f0f0' },
  tab: {
    padding: '12px 0', marginRight: '30px', background: 'none', border: 'none',
    fontSize: '16px', fontWeight: '500' as const, color: '#999', cursor: 'pointer',
    position: 'relative' as const, transition: 'color 0.2s'
  },
  tabActive: { color: '#333', fontWeight: '600' as const },
  
  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '25px' },
  card: { borderRadius: '24px', padding: '28px', minHeight: '300px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  cardTitle: { margin: 0, fontSize: '18px', fontWeight: '600' as const, color: 'white' },
  cardContent: { flex: 1 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' },
  metricBox: { background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' as const },
  metricValue: { margin: 0, fontSize: '28px', fontWeight: '700' as const, color: '#111', marginBottom: '5px' },
  metricLabel: { margin: 0, fontSize: '13px', color: '#666' },
  
  loadingContainer: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh', gap: '20px'
  },
  spinner: {
    width: '50px', height: '50px', border: '5px solid #f0f0f0',
    borderTop: '5px solid #4371f0', borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh', gap: '20px', padding: '20px'
  },
  errorText: { fontSize: '18px', color: '#e74c3c', textAlign: 'center' as const },
};