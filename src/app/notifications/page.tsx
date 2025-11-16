'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'campaign';

interface Notification {
  id: number;
  type: NotificationType;
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  time: string;
  isRead: boolean;
  post?: string;
}

export default function NotificationsPage() {
  const [activeNav, setActiveNav] = useState('notifications');
  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'comments' | 'mentions' | 'follows'>('all');

  const allNotifications: Notification[] = [
    {
      id: 1,
      type: 'like',
      user: { name: 'Felix Tan', avatar: '/assets/logo-icon.png' },
      message: 'liked your post',
      time: '5 minutes ago',
      isRead: false,
      post: 'Product showcase video',
    },
    {
      id: 2,
      type: 'comment',
      user: { name: 'Sarah Johnson', avatar: '/assets/logo-icon.png' },
      message: 'commented on your post: "This looks amazing!"',
      time: '15 minutes ago',
      isRead: false,
      post: 'Brand collaboration',
    },
    {
      id: 3,
      type: 'follow',
      user: { name: 'MJ TOYS', avatar: '/assets/logo-icon.png' },
      message: 'started following you',
      time: '1 hour ago',
      isRead: false,
    },
    {
      id: 4,
      type: 'mention',
      user: { name: 'Alex Chen', avatar: '/assets/logo-icon.png' },
      message: 'mentioned you in a post',
      time: '2 hours ago',
      isRead: true,
    },
    {
      id: 5,
      type: 'campaign',
      user: { name: 'Fashion Brand Co', avatar: '/assets/logo-icon.png' },
      message: 'invited you to join a campaign',
      time: '3 hours ago',
      isRead: true,
    },
    {
      id: 6,
      type: 'like',
      user: { name: 'Jenny Liu', avatar: '/assets/logo-icon.png' },
      message: 'liked your post',
      time: '5 hours ago',
      isRead: true,
      post: 'Tech review video',
    },
    {
      id: 7,
      type: 'comment',
      user: { name: 'David Kim', avatar: '/assets/logo-icon.png' },
      message: 'commented on your post: "Great content!"',
      time: '1 day ago',
      isRead: true,
      post: 'Weekly vlog',
    },
    {
      id: 8,
      type: 'follow',
      user: { name: 'Emma Wilson', avatar: '/assets/logo-icon.png' },
      message: 'started following you',
      time: '2 days ago',
      isRead: true,
    },
  ];

  const filteredNotifications = allNotifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'likes') return notif.type === 'like';
    if (activeTab === 'comments') return notif.type === 'comment';
    if (activeTab === 'mentions') return notif.type === 'mention';
    if (activeTab === 'follows') return notif.type === 'follow';
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return (
          <div style={{...styles.notifIcon, background: '#e357a3'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div style={{...styles.notifIcon, background: '#4371f0'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div style={{...styles.notifIcon, background: '#52c41a'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div style={{...styles.notifIcon, background: '#faad14'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
              <path d="M12 18V6"/>
            </svg>
          </div>
        );
      case 'campaign':
        return (
          <div style={{...styles.notifIcon, background: '#722ed1'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
        );
    }
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

      {/* Background Circles */}
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
            <Link href="/notifications" style={{...styles.navItem, ...(activeNav === 'notifications' && styles.navItemActive)}}>
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
          
          <div style={styles.sidebarDecoration}>
            <div style={{...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0'}}></div>
            <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s'}}></div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Notifications</h1>
            <button style={styles.markAllRead}>Mark all as read</button>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            <button 
              style={{...styles.tab, ...(activeTab === 'all' && styles.tabActive)}}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'likes' && styles.tabActive)}}
              onClick={() => setActiveTab('likes')}
            >
              Likes
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'comments' && styles.tabActive)}}
              onClick={() => setActiveTab('comments')}
            >
              Comments
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'mentions' && styles.tabActive)}}
              onClick={() => setActiveTab('mentions')}
            >
              Mentions
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'follows' && styles.tabActive)}}
              onClick={() => setActiveTab('follows')}
            >
              Follows
            </button>
          </div>

          {/* Notifications List */}
          <div style={styles.notificationsList}>
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                style={{
                  ...styles.notificationItem,
                  ...(notif.isRead ? {} : styles.notificationUnread)
                }}
              >
                <div style={styles.notificationContent}>
                  <div style={styles.notificationAvatar}>
                    <Image 
                      src={notif.user.avatar} 
                      alt={notif.user.name} 
                      width={50} 
                      height={50} 
                      style={{borderRadius: '50%', objectFit: 'cover'}}
                    />
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div style={styles.notificationText}>
                    <p style={styles.notificationMessage}>
                      <strong>{notif.user.name}</strong> {notif.message}
                    </p>
                    {notif.post && (
                      <p style={styles.notificationPost}>"{notif.post}"</p>
                    )}
                    <p style={styles.notificationTime}>{notif.time}</p>
                  </div>
                </div>

                {!notif.isRead && <div style={styles.unreadDot}></div>}
              </div>
            ))}
          </div>

          {/* Empty State (if no notifications) */}
          {filteredNotifications.length === 0 && (
            <div style={styles.emptyState}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <p style={styles.emptyText}>No notifications yet</p>
              <p style={styles.emptySubtext}>When you get notifications, they'll show up here</p>
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
    background: '#e8eaed',
    transition: 'all 0.2s ease',
  },
  navItemActive: { background: '#4371f0', color: 'white' },
  sidebarDecoration: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', overflow: 'hidden', pointerEvents: 'none' },
  sidebarCircle: { position: 'absolute', borderRadius: '50%', opacity: 0.5, animation: 'float 12s infinite ease-in-out' },

  mainContent: { flex: 1, marginLeft: '260px', padding: '40px 60px', zIndex: 10 },
  
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' },
  pageTitle: { fontSize: '38px', fontWeight: '700', color: '#111', margin: 0 },
  markAllRead: {
    padding: '10px 24px',
    background: 'white',
    border: '1.5px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  tabs: { display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '0' },
  tab: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '15px',
    fontWeight: '600',
    color: '#999',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '-2px',
  },
  tabActive: { color: '#4371f0', borderBottom: '3px solid #4371f0' },

  notificationsList: { display: 'flex', flexDirection: 'column', gap: '0' },
  notificationItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #f5f5f5',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  notificationUnread: { background: '#f9fbff' },
  
  notificationContent: { display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 },
  notificationAvatar: { position: 'relative', width: '50px', height: '50px', flexShrink: 0 },
  notifIcon: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
  },
  
  notificationText: { flex: 1 },
  notificationMessage: { margin: 0, fontSize: '15px', color: '#333', marginBottom: '4px', lineHeight: '1.5' },
  notificationPost: { margin: 0, fontSize: '14px', color: '#666', marginBottom: '6px', fontStyle: 'italic' },
  notificationTime: { margin: 0, fontSize: '13px', color: '#999' },
  
  unreadDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#4371f0',
    flexShrink: 0,
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  emptyText: { fontSize: '20px', fontWeight: '600', color: '#666', margin: '20px 0 8px' },
  emptySubtext: { fontSize: '15px', color: '#999', margin: 0 },
};