'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MessagesPage() {
  const [activeNav, setActiveNav] = useState('messages');
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState('Felix Tan');

  const chatList = Array(12).fill({
    name: 'Felix Tan',
    category: 'Tech',
    followers: '143K Followers'
  });

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
            <Link href="/messages" style={{...styles.navItem, ...(activeNav === 'messages' && styles.navItemActive)}}>
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
            <Link href="/work" style={styles.navItem}>
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

        {/* Messages Panel */}
        <div style={styles.messagesPanel}>
          {/* Header */}
          <div style={styles.messagesPanelHeader}>
            <h2 style={styles.username}>owenc.s</h2>
            <div style={styles.headerIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchBar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              placeholder="search" 
              style={styles.searchInput}
            />
          </div>

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <button 
              style={{...styles.tab, ...(activeTab === 'chats' && styles.tabActive)}}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'jobs' && styles.tabInactive)}}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </button>
          </div>

          {/* Chat List */}
          <div style={styles.chatList}>
            {chatList.map((chat, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.chatItem,
                  ...(index === 0 && styles.chatItemActive)
                }}
                onClick={() => setSelectedChat(chat.name)}
              >
                <div style={styles.chatAvatar}></div>
                <div style={styles.chatInfo}>
                  <h3 style={styles.chatName}>{chat.name}</h3>
                  <p style={styles.chatMeta}>{chat.category} | {chat.followers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content Area */}
        <div style={styles.chatContent}>
          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderLeft}>
              <div style={styles.chatHeaderAvatar}>
                <Image src="/assets/fotomes.png" alt={selectedChat} width={50} height={50} style={{borderRadius: '50%', objectFit: 'cover'}} />
              </div>
              <h2 style={styles.chatHeaderName}>{selectedChat}</h2>
            </div>
          </div>

          {/* Empty Chat Area */}
          <div style={styles.emptyChat}>
            {/* You can add chat messages here */}
          </div>

          {/* Message Input */}
          <div style={styles.messageInputContainer}>
            <div style={styles.messageInputBar}></div>
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
  medium: { width: '140px', height: '140px' },
  small: { width: '90px', height: '90px' },
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
  messagesPanel: {
    width: '420px',
    marginLeft: '300px',
    background: '#ffffff',
    borderRight: '1px solid #f0f0f0',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    zIndex: 50,
  },
  messagesPanelHeader: {
    padding: '25px 30px 15px 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f5f5f5',
  },
  username: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#111',
  },
  headerIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'background 0.2s',
  },
  searchBar: {
    margin: '15px 30px 15px 30px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f5f7fa',
    borderRadius: '12px',
    padding: '12px 18px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
  },
  tabsContainer: {
    display: 'flex',
    padding: '0 30px 15px 30px',
    marginBottom: '5px',
    gap: '10px',
  },
  tab: {
    padding: '10px 28px',
    background: 'transparent',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tabActive: {
    background: '#e357a3',
    color: 'white',
  },
  tabInactive: {
    background: 'transparent',
    color: '#999',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 0 20px 0',
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 30px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderLeft: '3px solid transparent',
  },
  chatItemActive: {
    background: '#f9f9f9',
    borderLeft: '3px solid #e357a3',
  },
  chatAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ccc, #888)',
    flexShrink: 0,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '4px',
  },
  chatMeta: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  },
  chatContent: {
    flex: 1,
    marginLeft: '700px',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    zIndex: 10,
  },
  chatHeader: {
    padding: '25px 40px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  chatHeaderAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  chatHeaderName: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
  },
  emptyChat: {
    flex: 1,
    background: '#fafafa',
  },
  messageInputContainer: {
    padding: '25px 40px',
    borderTop: '1px solid #f0f0f0',
  },
  messageInputBar: {
    height: '50px',
    background: '#f5f7fa',
    borderRadius: '25px',
  },
};