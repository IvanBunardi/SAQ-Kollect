'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MessagesPage() {
  const [activeNav, setActiveNav] = useState('messages');
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState('Felix Tan');
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);

  const chatList = Array(12).fill({
    name: 'Felix Tan',
    category: 'Tech',
    followers: '143K Followers'
  });

  const handleAccept = () => {
    setShowAcceptedModal(true);
  };

  const handleDecline = () => {
    // Handle decline logic
    console.log('Declined');
  };

  const handleChatFromModal = () => {
    setShowAcceptedModal(false);
    setActiveTab('chats');
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
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, top: '-180px', left: '-180px' }}></div>
        <div style={{ ...styles.circle, ...styles.lightpink, ...styles.extrabig, top: '-120px', left: '120px' }}></div>
        <div style={{ ...styles.circle, ...styles.lightblue, ...styles.big, top: '50px', left: '150px' }}></div>
        <div style={{ ...styles.circle, ...styles.blue, ...styles.huge, bottom: '-150px', left: '-120px' }}></div>
        <div style={{ ...styles.circle, ...styles.pink, ...styles.extrabig, bottom: '-80px', left: '180px' }}></div>
      </div>

      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.logo}>
            <Image src="/assets/logo-full.png" alt="Kollect Logo" width={200} height={106} style={{ objectFit: 'contain' }} />
          </div>

          <nav style={styles.navMenu}>
            <Link href="/feeds" style={{ ...styles.navItem, ...(activeNav === 'home' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>

            <Link href="/search" style={{ ...styles.navItem, ...(activeNav === 'search' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>Search</span>
            </Link>

            <Link href="/" style={{ ...styles.navItem, ...(activeNav === 'explore' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>Explore</span>
            </Link>

            <Link href="/messages" style={{ ...styles.navItem, ...(activeNav === 'messages' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Messages</span>
            </Link>

            <Link href="/notifications" style={{ ...styles.navItem, ...(activeNav === 'notifications' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>Notifications</span>
            </Link>

            <Link href="/create" style={{ ...styles.navItem, ...(activeNav === 'create' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Create</span>
            </Link>

            <Link href="/profile" style={{ ...styles.navItem, ...(activeNav === 'profile' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </Link>

            <Link href="/work" style={{ ...styles.navItem, ...(activeNav === 'work' && styles.navItemActive) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Work</span>
            </Link>
          </nav>

          {/* Decorative Circles */}
          <div style={styles.sidebarDecoration}>
            <div style={{ ...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0' }}></div>
            <div style={{ ...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Messages Panel */}
        <div style={styles.messagesPanel}>
          <div style={styles.messagesPanelHeader}>
            <h2 style={styles.username}>MJ TOYS</h2>
            <div style={styles.headerIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>

          <div style={styles.searchBar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="search" style={styles.searchInput} />
          </div>

          <div style={styles.tabsContainer}>
            <button 
              style={{ ...styles.tab, ...(activeTab === 'chats' && styles.tabActive), ...(activeTab !== 'chats' && styles.tabInactive) }} 
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button 
              style={{ ...styles.tab, ...(activeTab === 'jobs' && styles.tabActive), ...(activeTab !== 'jobs' && styles.tabInactive) }} 
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </button>
          </div>

          <div style={styles.chatList}>
            {chatList.map((chat, index) => (
              <div
                key={index}
                style={{ ...styles.chatItem, ...(index === 0 && styles.chatItemActive) }}
                onClick={() => setSelectedChat(chat.name)}
              >
                <div style={styles.chatAvatar}></div>
                <div style={styles.chatInfo}>
                  <h3 style={styles.chatName}>{chat.name}</h3>
                  <p style={styles.chatMeta}>
                    {chat.category} | {chat.followers}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content / Jobs Form */}
        <div style={styles.chatContent}>
          {activeTab === 'chats' ? (
            <>
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderLeft}>
                  <div style={styles.chatHeaderAvatar}>
                    <Image src="/assets/fotomes.png" alt={selectedChat} width={50} height={50} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <h2 style={styles.chatHeaderName}>{selectedChat}</h2>
                </div>
              </div>

              <div style={styles.emptyChat}></div>

              <div style={styles.messageInputContainer}>
                <div style={styles.messageInputBar}></div>
              </div>
            </>
          ) : (
            <>
              {/* Jobs Form Header */}
              <div style={styles.jobsHeader}>
                <div style={styles.jobsHeaderLeft}>
                  <div style={styles.jobsAvatar}>
                    <Image src="/assets/fotomes.png" alt="Felix Tan" width={50} height={50} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <h2 style={styles.jobsHeaderName}>Felix Tan</h2>
                </div>
              </div>

              {/* Jobs Form Content */}
              <div style={styles.jobsFormContainer}>
                <div style={styles.jobsForm}>
                  {/* Name Field */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Name</label>
                    <input type="text" style={styles.formInput} />
                  </div>

                  {/* Industry Field */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Industry</label>
                    <input type="text" style={styles.formInput} />
                  </div>

                  {/* Why interested Field */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Why are you interested in this</label>
                    <textarea style={styles.formTextarea} rows={3}></textarea>
                  </div>

                  {/* Content Idea Field */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Your Content Idea / Concept</label>
                    <textarea style={styles.formTextarea} rows={3}></textarea>
                  </div>

                  {/* Expected Fee Range */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Expected Fee Range</label>
                    <input type="text" style={styles.formInput} />
                  </div>

                  {/* Availability Date and Number of Deliverables */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroupHalf}>
                      <label style={styles.formLabel}>Availability Date</label>
                      <input type="text" style={styles.formInput} />
                    </div>
                    <div style={styles.formGroupHalf}>
                      <label style={styles.formLabel}>Number of Deliverables You</label>
                      <input type="text" style={styles.formInput} />
                    </div>
                  </div>

                  {/* Platform Checkboxes */}
                  <div style={styles.checkboxGrid}>
                    <label style={styles.checkboxLabel}>
                      <input type="checkbox" style={styles.checkbox} />
                      <span style={styles.checkboxText}>IG Feeds</span>
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input type="checkbox" style={styles.checkbox} />
                      <span style={styles.checkboxText}>IG Reels</span>
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input type="checkbox" style={styles.checkbox} />
                      <span style={styles.checkboxText}>IG Story</span>
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input type="checkbox" style={styles.checkbox} />
                      <span style={styles.checkboxText}>TikTok</span>
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input type="checkbox" style={styles.checkbox} />
                      <span style={styles.checkboxText}>YouTube</span>
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input type="checkbox" style={styles.checkbox} />
                      <span style={styles.checkboxText}>X (Twitter)</span>
                    </label>
                  </div>

                  {/* Past Relevant Campaigns */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Past Relevant Campaigns</label>
                    <textarea style={styles.formTextarea} rows={3} placeholder="🔗"></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.formActions}>
                    <button style={styles.declineButton} onClick={handleDecline}>Decline</button>
                    <button style={styles.acceptButton} onClick={handleAccept}>Accept</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Accepted Modal */}
      {showAcceptedModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowAcceptedModal(false)}></div>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Accepted!</h2>
            <div style={styles.checkmarkContainer}>
              <svg width="80" height="80" viewBox="0 0 100 100" style={styles.checkmark}>
                <polyline 
                  points="20,50 40,70 80,30" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <button style={styles.chatButton} onClick={handleChatFromModal}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat
            </button>
          </div>
        </>
      )}
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
  sidebarDecoration: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', overflow: 'hidden' },
  sidebarCircle: { position: 'absolute', borderRadius: '50%', opacity: 0.5, animation: 'float 12s infinite ease-in-out' },

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
  username: { margin: 0, fontSize: '20px', fontWeight: '600', color: '#111' },
  headerIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '10px',
  },
  searchBar: { margin: '15px 30px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f5f7fa', borderRadius: '12px', padding: '12px 18px' },
  searchInput: { flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: '#333', outline: 'none' },
  tabsContainer: { display: 'flex', padding: '0 30px 15px 30px', gap: '10px' },
  tab: {
    padding: '10px 28px',
    background: 'transparent',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'all 0.2s',
  },
  tabActive: { background: '#e357a3', color: 'white' },
  tabInactive: { color: '#999', background: 'transparent' },
  chatList: { flex: 1, overflowY: 'auto', paddingBottom: '20px' },
  chatItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 30px', borderLeft: '3px solid transparent', cursor: 'pointer' },
  chatItemActive: { background: '#f9f9f9', borderLeft: '3px solid #e357a3' },
  chatAvatar: { width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #ccc, #888)' },
  chatInfo: { flex: 1 },
  chatName: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '4px' },
  chatMeta: { margin: 0, fontSize: '13px', color: '#666' },

  chatContent: { flex: 1, marginLeft: '700px', display: 'flex', flexDirection: 'column', background: 'white' },
  chatHeader: { padding: '25px 40px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  chatHeaderAvatar: { width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' },
  chatHeaderName: { margin: 0, fontSize: '18px', fontWeight: '600', color: '#111' },
  emptyChat: { flex: 1, background: '#fafafa' },
  messageInputContainer: { padding: '25px 40px', borderTop: '1px solid #f0f0f0' },
  messageInputBar: { height: '50px', background: '#f5f7fa', borderRadius: '25px' },

  // Jobs Form Styles
  jobsHeader: {
    padding: '25px 40px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    background: 'white',
  },
  jobsHeaderLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  jobsAvatar: { width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' },
  jobsHeaderName: { margin: 0, fontSize: '18px', fontWeight: '600', color: '#111' },
  
  jobsFormContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '30px 40px',
    background: '#fafafa',
  },
  jobsForm: {
  background: '#f7f9fc', 
  borderRadius: '16px',
  padding: '30px',
  maxWidth: '900px',
  border: '1px solid #d0d6df', 
},
  formGroup: {
    marginBottom: '20px',
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formTextarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '30px',
  },
  declineButton: {
    padding: '12px 32px',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  acceptButton: {
    padding: '12px 32px',
    background: '#e357a3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    borderRadius: '16px',
    padding: '40px 50px',
    zIndex: 1000,
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    minWidth: '320px',
  },
  modalTitle: {
    margin: '0 0 30px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#111',
  },
  checkmarkContainer: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  checkmark: {
    display: 'block',
  },
  chatButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 40px',
    background: '#e357a3',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};