'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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

interface UserProfile {
  id?: string;
  username: string;
  fullname: string;
  profilePhoto?: string;
  profilePicture?: string;
  bio?: string;
  category?: string;
  role?: string;
  email?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [activeNav, setActiveNav] = useState('profile');
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk Like & Save
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [savingPosts, setSavingPosts] = useState<Set<string>>(new Set());

  // ✅ State untuk Follow/Unfollow
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (username) {
      checkIfOwnProfile();
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [username]);

  // ✅ Check if this is the current user's profile
  const checkIfOwnProfile = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentUsername = payload.username;
        setIsOwnProfile(currentUsername === username);
      } catch (err) {
        console.error('Failed to parse token:', err);
      }
    }
  };

  // ✅ Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${username}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Profile loaded:', data.user);
        setUserProfile(data.user);
        setIsFollowing(data.user.isFollowing || false);
        setFollowersCount(data.user.followersCount || 0);
        setFollowingCount(data.user.followingCount || 0);
      } else {
        console.error('Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  // ✅ Fetch User Posts
  const fetchUserPosts = async () => {
    try {
      console.log('📡 Fetching posts for:', username);

      const res = await fetch(`/api/post/user/${username}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        console.error('Failed to load posts');
        setError('Failed to load posts');
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('✅ Posts loaded:', data.posts.length);
      setPosts(data.posts || []);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
      setError('Network error');
      setLoading(false);
    }
  };

  // ✅ Handle Follow/Unfollow
  const handleFollowToggle = async () => {
    if (followLoading || !userProfile?.id) return;

    try {
      setFollowLoading(true);

      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`/api/user/${userProfile.id}/follow`, {
        method,
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        console.log('✅', data.message);
        
        // Update state
        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      } else {
        console.error('❌ Failed:', data.message);
        alert(data.message);
      }
    } catch (err) {
      console.error('❌ Error following:', err);
      alert('Failed to follow/unfollow');
    } finally {
      setFollowLoading(false);
    }
  };

  // ✅ Handle Like
  const handleLike = async (postId: string, isLiked: boolean) => {
    if (likingPosts.has(postId)) return;

    try {
      setLikingPosts(prev => new Set(prev).add(postId));

      const method = isLiked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/post/${postId}/like`, {
        method,
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  isLikedByUser: !isLiked,
                  likesCount: data.likesCount 
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // ✅ Handle Save
  const handleSave = async (postId: string, isSaved: boolean) => {
    if (savingPosts.has(postId)) return;

    try {
      setSavingPosts(prev => new Set(prev).add(postId));

      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch(`/api/post/${postId}/save`, {
        method,
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  isSavedByUser: !isSaved,
                  savesCount: data.savesCount 
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error saving post:', err);
    } finally {
      setSavingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
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

  // ✅ Function untuk get avatar URL dengan fallback
  const getAvatarUrl = (profilePhoto?: string, profilePicture?: string, fallbackName?: string) => {
    if (profilePhoto && profilePhoto.trim() !== '') {
      return profilePhoto;
    }
    if (profilePicture && profilePicture.trim() !== '') {
      return profilePicture;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'User')}&background=random&size=150&bold=true`;
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
        <div style={{...styles.circle, ...styles.blue, ...styles.huge, bottom: '-150px', left: '-120px'}}></div>
        <div style={{...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-80px', left: '180px'}}></div>
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
          {/* Profile Header */}
          <div style={styles.profileHeader}>
            {/* Profile Picture */}
            <div style={styles.profileAvatar}>
              <img
                src={getAvatarUrl(
                  userProfile?.profilePhoto,
                  userProfile?.profilePicture,
                  userProfile?.fullname || username
                )}
                alt={userProfile?.fullname || username}
                style={{
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  borderRadius: '50%'
                }}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.fullname || username)}&background=e357a3&color=fff&size=150&bold=true`;
                }}
              />
            </div>
            
            <div style={styles.profileInfo}>
              <h1 style={styles.profileName}>{userProfile?.fullname || username}</h1>
              <p style={styles.profileRole}>{userProfile?.role?.toUpperCase() || 'USER'}</p>
              <p style={styles.profileUsername}>
                @{username}
                {userProfile?.email && ` • ${userProfile.email}`}
              </p>
              
              {/* ✅ REAL FOLLOWERS/FOLLOWING COUNT */}
              <div style={{display: 'flex', gap: '20px', marginTop: '12px', marginBottom: '12px'}}>
                <span style={{fontSize: '15px', color: '#333'}}>
                  <strong>{followersCount}</strong> followers
                </span>
                <span style={{fontSize: '15px', color: '#333'}}>
                  <strong>{followingCount}</strong> following
                </span>
              </div>
              
              {userProfile?.bio && <p style={styles.profileBio}>{userProfile.bio}</p>}
              
              {/* ✅ FOLLOW/UNFOLLOW & MESSAGE BUTTON */}
              {!isOwnProfile && (
                <div style={{marginTop: '20px', display: 'flex', gap: '12px'}}>
                  <button
                    style={{
                      padding: '10px 24px',
                      background: isFollowing ? '#f0f2f5' : '#e357a3',
                      color: isFollowing ? '#333' : 'white',
                      border: isFollowing ? '1px solid #ddd' : 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: followLoading ? 'wait' : 'pointer',
                      opacity: followLoading ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                  >
                    {followLoading ? 'Loading...' : (isFollowing ? 'Unfollow' : 'Follow')}
                  </button>
                  
                  <button
                    style={{
                      padding: '10px 24px',
                      background: '#f0f2f5',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => router.push(`/messages/compose?to=${username}`)}
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
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
              style={{...styles.tab, ...(activeTab === 'work' && styles.tabActive)}}
              onClick={() => setActiveTab('work')}
            >
              Work
            </button>
          </div>

          {/* Posts Grid */}
          <div style={{marginTop: '30px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '20px'}}>
              Recent Posts ({posts.length})
            </h2>

            {loading ? (
              <div style={styles.loadingBox}>Loading posts...</div>
            ) : error ? (
              <div style={styles.errorBox}>{error}</div>
            ) : posts.length === 0 ? (
              <div style={styles.emptyBox}>
                <p>No posts yet.</p>
              </div>
            ) : (
              <div style={styles.feedGrid}>
                {posts.map((post) => (
                  <div key={post._id} style={{...styles.feedCard, background: 'linear-gradient(135deg, #a5c8f0, #c8ddf0)'}}>
                    <div style={styles.feedHeader}>
                      <div style={styles.userAvatar}>
                        <img 
                          src={getAvatarUrl(
                            post.user?.profilePhoto,
                            undefined,
                            post.user?.name || post.user?.username
                          )}
                          alt={post.user?.name} 
                          style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || 'User')}&background=random&size=50&bold=true`;
                          }}
                        />
                      </div>
                      <div>
                        <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>{post.user?.name}</h3>
                        <p style={{margin: 0, fontSize: '13px', color: '#666'}}>
                          @{post.user?.username} • {formatTimeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {post.caption && (
                      <div style={styles.feedText}>{post.caption}</div>
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
                        <button 
                          style={{
                            ...styles.actionBtn,
                            opacity: likingPosts.has(post._id) ? 0.5 : 1,
                            cursor: likingPosts.has(post._id) ? 'wait' : 'pointer'
                          }}
                          onClick={() => handleLike(post._id, post.isLikedByUser)}
                          disabled={likingPosts.has(post._id)}
                        >
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill={post.isLikedByUser ? '#e74c3c' : 'none'} 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
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

                        <button 
                          style={{
                            ...styles.actionBtn,
                            opacity: savingPosts.has(post._id) ? 0.5 : 1,
                            cursor: savingPosts.has(post._id) ? 'wait' : 'pointer'
                          }}
                          onClick={() => handleSave(post._id, post.isSavedByUser)}
                          disabled={savingPosts.has(post._id)}
                        >
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill={post.isSavedByUser ? 'currentColor' : 'none'} 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
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
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    marginBottom: '40px',
  },
  profileAvatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #555, #888)',
    overflow: 'hidden',
  },
  profileInfo: {},
  profileName: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  profileRole: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e357a3',
    margin: '0 0 8px 0',
  },
  profileUsername: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 12px 0',
  },
  profileBio: {
    fontSize: '15px',
    color: '#333',
    maxWidth: '500px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    borderBottom: '2px solid #f0f0f0',
    marginBottom: '30px',
  },
  tab: {
    padding: '12px 28px',
    background: 'transparent',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
    color: '#999',
  },
  tabActive: {
    color: '#e357a3',
    borderBottom: '3px solid #e357a3',
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
    overflow: 'hidden',
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
    marginBottom: '12px',
  },
  feedImage: {
    flex: 1,
    height: '500px',
    objectFit: 'cover',
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