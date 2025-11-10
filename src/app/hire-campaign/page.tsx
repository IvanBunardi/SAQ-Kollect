'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HireCampaignPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('profile');
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSend = () => {
    setShowSuccessModal(true);
  };

  const handleBackToHome = () => {
    router.push('feeds');
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px); }
          25%  { transform: translateY(-20px) translateX(15px); }
          50%  { transform: translateY(10px) translateX(-10px); }
          75%  { transform: translateY(-15px) translateX(20px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>

      {/* Background particles - МНОГО И ЯРКИЕ */}
      <div style={styles.particles}>
        {/* Left side particles */}
        <div style={{...styles.particle, width: '280px', height: '280px', background: '#5B8EF5', top: '5%', left: '5%', animationDelay: '0s'}}></div>
        <div style={{...styles.particle, width: '180px', height: '180px', background: '#F48FB1', top: '15%', left: '8%', animationDelay: '1.5s'}}></div>
        <div style={{...styles.particle, width: '120px', height: '120px', background: '#90CAF9', top: '25%', left: '3%', animationDelay: 's'}}></div>
        <div style={{...styles.particle, width: '90px', height: '90px', background: '#CE93D8', top: '10%', left: '12%', animationDelay: '2s'}}></div>
        
        <div style={{...styles.particle, width: '250px', height: '250px', background: '#EC407A', bottom: '10%', left: '2%', animationDelay: '1s'}}></div>
        <div style={{...styles.particle, width: '160px', height: '160px', background: '#F48FB1', bottom: '5%', left: '10%', animationDelay: '2.5s'}}></div>
        <div style={{...styles.particle, width: '100px', height: '100px', background: '#90CAF9', bottom: '20%', left: '5%', animationDelay: '1.8s'}}></div>

        {/* Bottom center particles */}
        <div style={{...styles.particle, width: '350px', height: '350px', background: '#5C6BC0', bottom: '-10%', left: '25%', animationDelay: '0.5s'}}></div>
        <div style={{...styles.particle, width: '200px', height: '200px', background: '#EC407A', bottom: '5%', left: '35%', animationDelay: '2s'}}></div>
        <div style={{...styles.particle, width: '140px', height: '140px', background: '#90CAF9', bottom: '8%', left: '30%', animationDelay: '3.2s'}}></div>
        <div style={{...styles.particle, width: '180px', height: '180px', background: '#F48FB1', bottom: '15%', left: '40%', animationDelay: '1.2s'}}></div>
        <div style={{...styles.particle, width: '110px', height: '110px', background: '#CE93D8', bottom: '3%', left: '42%', animationDelay: '2.8s'}}></div>

        {/* Right side particles */}
        <div style={{...styles.particle, width: '300px', height: '300px', background: '#F48FB1', bottom: '8%', right: '5%', animationDelay: '1.5s'}}></div>
        <div style={{...styles.particle, width: '200px', height: '200px', background: '#5C6BC0', bottom: '15%', right: '10%', animationDelay: '2.3s'}}></div>
        <div style={{...styles.particle, width: '150px', height: '150px', background: '#90CAF9', bottom: '5%', right: '12%', animationDelay: '0.8s'}}></div>
        <div style={{...styles.particle, width: '120px', height: '120px', background: '#EC407A', bottom: '20%', right: '8%', animationDelay: '3.5s'}}></div>
      </div>
      

      <div style={styles.container}>
        {/* Sidebar - KONSISTEN DENGAN HALAMAN LAIN */}
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
            <Link href="/profile" style={{...styles.navItem, ...(activeNav === 'profile' && styles.navItemActive)}}>
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
          
          {/* Decorative circles in sidebar */}
          <div style={styles.sidebarDecoration}>
            <div style={{...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0'}}></div>
            <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s'}}></div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Header */}
          <div style={styles.header}>
            <button style={styles.backButton} onClick={() => router.back()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back</span>
            </button>
            <h1 style={styles.pageTitle}>Hire for Campaign</h1>
          </div>

          {/* Form Container with glassmorphism */}
          <div style={styles.formContainer}>
            {currentStep === 1 && (
              <>
                <div style={styles.formSection}>
                  <h2 style={styles.sectionTitle}>Campaign Brief</h2>
                  <p style={styles.sectionSubtitle}>Tell us about your campaign objectives and requirements</p>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Campaign Name</label>
                    <input type="text" style={styles.input} />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroupHalf}>
                      <label style={styles.label}>Brand/Company</label>
                      <input type="text" style={styles.input} />
                    </div>
                    <div style={styles.formGroupHalf}>
                      <label style={styles.label}>Industry</label>
                      <input type="text" style={styles.input} />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Campaign Description</label>
                    <textarea style={styles.textarea} rows={4}></textarea>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Target Audience</label>
                    <textarea style={styles.textarea} rows={4}></textarea>
                  </div>
                </div>

                <div style={styles.formActions}>
                  <button style={styles.nextButton} onClick={handleNext}>
                    Next
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft: '8px'}}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div style={styles.formSection}>
                  <h2 style={styles.sectionTitle}>Budget and Timeline</h2>
                  <p style={styles.sectionSubtitle}>Tell us about your campaign budget and timeline</p>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Campaign Budget Range</label>
                    <input type="text" style={styles.input} />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroupHalf}>
                      <label style={styles.label}>Campaign Start Date</label>
                      <input type="text" style={styles.input} />
                    </div>
                    <div style={styles.formGroupHalf}>
                      <label style={styles.label}>Campaign Deadline</label>
                      <input type="text" style={styles.input} />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Content Types Required</label>
                    <div style={styles.checkboxGrid}>
                      <label style={styles.checkboxItem}>
                        <input type="checkbox" style={styles.checkbox} />
                        <span>IG Feeds</span>
                      </label>
                      <label style={styles.checkboxItem}>
                        <input type="checkbox" style={styles.checkbox} />
                        <span>IG Reels</span>
                      </label>
                      <label style={styles.checkboxItem}>
                        <input type="checkbox" style={styles.checkbox} />
                        <span>IG Story</span>
                      </label>
                      <label style={styles.checkboxItem}>
                        <input type="checkbox" style={styles.checkbox} />
                        <span>TikTok</span>
                      </label>
                      <label style={styles.checkboxItem}>
                        <input type="checkbox" style={styles.checkbox} />
                        <span>YouTube</span>
                      </label>
                      <label style={styles.checkboxItem}>
                        <input type="checkbox" style={styles.checkbox} />
                        <span>X (Twitter)</span>
                      </label>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Campaign Specifications / Requirements</label>
                    <textarea style={styles.textarea} rows={4}></textarea>
                  </div>
                </div>

                <div style={styles.formActions}>
                  <button style={styles.sendButton} onClick={handleSend}>
                    Send
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft: '8px'}}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div style={styles.modalOverlay}></div>
          <div style={styles.successModal}>
            <h2 style={styles.modalTitle}>Sent!</h2>
            <div style={styles.checkmarkContainer}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <path 
                  d="M20,55 L40,75 L80,30" 
                  fill="none" 
                  stroke="#4caf50" 
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p style={styles.modalText}>Please wait for their reply!</p>
            <button style={styles.backToHomeButton} onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
        </>
      )}
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  particles: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.7,
    animation: 'float 20s infinite ease-in-out',
    filter: 'blur(2px)',
  },
  
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#ffffff',
    position: 'relative',
    zIndex: 1,
  },
  
  // SIDEBAR KONSISTEN DENGAN HALAMAN LAIN
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
    padding: '30px 50px 80px 50px',
    zIndex: 10,
    position: 'relative',
  },
  header: {
    marginBottom: '30px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(236, 64, 122, 0.3)',
    transition: 'all 0.2s',
  },
  pageTitle: {
    margin: 40,
    fontSize: '46px',
    fontWeight: '700',
    color: '#111',
  },
  
  formContainer: {
    maxWidth: '7000px',
    background: '#f7f9fc',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '35px 40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
  },
  formSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '6px',
  },
  sectionSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '28px',
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
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
    transition: 'all 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '13px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    background: 'white',
    transition: 'all 0.2s',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  checkboxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '13px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#333',
    fontWeight: '500',
    background: 'white',
    transition: 'all 0.2s',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#EC407A',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
  },
  nextButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '13px 35px',
    background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(236, 64, 122, 0.3)',
  },
  sendButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '13px 35px',
    background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(236, 64, 122, 0.3)',
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 998,
  },
  successModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    borderRadius: '20px',
    padding: '45px 55px',
    zIndex: 999,
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
    minWidth: '420px',
  },
  modalTitle: {
    margin: '0 0 25px 0',
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
  },
  checkmarkContainer: {
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'center',
  },
  modalText: {
    margin: '0 0 35px 0',
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '500',
  },
  backToHomeButton: {
    padding: '13px 40px',
    background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(236, 64, 122, 0.3)',
  },
};

