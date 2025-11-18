'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>('settings');
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('edit-profil');
  const [selectedGender, setSelectedGender] = useState<string>('Memilih tidak memberi tahu');
  
  type User = {
    fullname?: string;
    username?: string;
    website?: string;
    bio?: string;
    gender?: string;
  };

  // User data state
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  
  // Form data
  type ProfileForm = {
    fullname: string;
    username: string;
    website: string;
    bio: string;
    gender: string;
  };

  const [formData, setFormData] = useState<ProfileForm>({
    fullname: '',
    username: '',
    website: '',
    bio: '',
    gender: 'Memilih tidak memberi tahu'
  });

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No token found, redirecting to login');
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
      console.log('📦 User data:', data);
      
      if (data.success && data.user) {
        const u: User = data.user || {};
        setUserData(u);
        setFormData({
          fullname: u.fullname || '',
          username: u.username || '',
          website: u.website || '',
          bio: u.bio || '',
          gender: u.gender || 'Memilih tidak memberi tahu'
        });
        setSelectedGender(u.gender || 'Memilih tidak memberi tahu');
      } else {
        setError(data.message || 'Failed to load profile');
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    } catch (err) {
      console.error('❌ Profile fetch error:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGender(value);
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('💾 Saving profile...', formData);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          username: formData.username,
        }),
      });

      const data = await response.json();
      console.log('📦 Update response:', data);

      if (data.success && data.user) {
        setUserData(data.user as User);
        setSaveSuccess('Profil berhasil diperbarui!');
        console.log('✅ Profile updated successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setSaveError(data.message || 'Gagal memperbarui profil');
        console.error('❌ Update error:', data.message);
      }
    } catch (err) {
      console.error('❌ Profile update error:', err);
      setSaveError('Gagal memperbarui profil');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          66% { transform: translateY(15px) translateX(-10px) rotate(-3deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        {/* Main Sidebar */}
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
            <Link href="/work" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>Work</span>
            </Link>
            <Link href="/settings" style={{...styles.navItem, ...(activeNav === 'settings' && styles.navItemActive)}}>
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
            <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s'}}></div>
          </div>
        </div>

        {/* Settings Menu Panel */}
        <div style={styles.settingsMenu}>
          <h2 style={styles.settingsTitle}>Pengaturan</h2>
          
          <div style={styles.settingsMenuList}>
            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'edit-profil' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('edit-profil')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Edit profil</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'notifications' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('notifications')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>Notifications</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'account-privacy' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('account-privacy')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 11h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h4"/>
                <path d="M12 3v13"/>
                <path d="m8 12 4 4 4-4"/>
              </svg>
              <span>Account privacy</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'close-friend' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('close-friend')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Close Friend</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'blocked' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('blocked')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              <span>Blocked</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'archiving' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('archiving')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="21 8 21 21 3 21 3 8"/>
                <rect x="1" y="3" width="22" height="5"/>
                <line x1="10" y1="12" x2="14" y2="12"/>
              </svg>
              <span>Archiving & Downloading</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'language' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('language')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>Language</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {activeSettingsTab === 'edit-profil' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>Edit Profil</h1>

              {/* Success/Error Messages */}
              {saveSuccess && (
                <div style={styles.successMessage}>
                  {saveSuccess}
                </div>
              )}
              {saveError && (
                <div style={styles.errorMessage}>
                  {saveError}
                </div>
              )}

              {/* Profile Photo Section */}
              <div style={styles.profilePhotoSection}>
                <div style={styles.profilePhoto}>
                  <Image src="/assets/logo-icon.png" alt={userData?.username || 'User'} width={70} height={70} style={{borderRadius: '50%', objectFit: 'cover'}} />
                </div>
                <div style={styles.profileInfo}>
                  <h3 style={styles.profileName}>{userData?.username || 'Loading...'}</h3>
                </div>
                <button style={styles.photoButton}>Ubah foto</button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name</label>
                  <input 
                    type="text" 
                    name="fullname"
                    style={styles.input}
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Username</label>
                  <input 
                    type="text" 
                    name="username"
                    style={styles.input}
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Situs Web</label>
                  <input 
                    type="text" 
                    name="website"
                    style={styles.input}
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Situs Web"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Bio</label>
                  <textarea 
                    name="bio"
                    style={styles.textarea}
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Bio"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Jenis Kelamin</label>
                  <select 
                    name="gender"
                    style={styles.select}
                    value={selectedGender}
                    onChange={handleGenderChange}
                  >
                    <option value="Memilih tidak memberi tahu">Memilih tidak memberi tahu</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  style={{...styles.submitButton, opacity: saveLoading ? 0.6 : 1}}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Menyimpan...' : 'Kirim'}
                </button>
              </form>
            </div>
          )}

          {activeSettingsTab === 'notifications' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>Notification</h1>

              <div style={styles.notificationList}>
                <div style={styles.notificationItem}>
                  <span style={styles.notificationText}>Automatic notifications</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>

                <div style={styles.notificationItem}>
                  <span style={styles.notificationText}>Email notifications</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'account-privacy' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>Account Privacy</h1>
              <p style={styles.placeholderText}>Account privacy settings will appear here.</p>
            </div>
          )}

          {activeSettingsTab === 'close-friend' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>Close Friend</h1>
              <p style={styles.placeholderText}>Close friend settings will appear here.</p>
            </div>
          )}

          {activeSettingsTab === 'blocked' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>Blocked</h1>
              <p style={styles.placeholderText}>Blocked accounts will appear here.</p>
            </div>
          )}

          {activeSettingsTab === 'archiving' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>Archiving & Downloading</h1>
              <p style={styles.placeholderText}>Archive and download options will appear here.</p>
            </div>
          )}

          {activeSettingsTab === 'language' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>Language</h1>
              <p style={styles.placeholderText}>Language settings will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: CSSProperties } = {
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

  // Main Sidebar
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
    cursor: 'pointer',
    border: 'none',
  },
  navItemActive: { background: '#4371f0', color: 'white' },
  sidebarDecoration: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', overflow: 'hidden', pointerEvents: 'none' },
  sidebarCircle: { position: 'absolute', borderRadius: '50%', opacity: 0.5, animation: 'float 12s infinite ease-in-out' },

  // Settings Menu Panel
  settingsMenu: {
    width: '280px',
    marginLeft: '300px',
    background: '#ffffff',
    borderRight: '1px solid #e8e8e8',
    height: '100vh',
    position: 'fixed',
    padding: '40px 20px',
    overflowY: 'auto',
    zIndex: 50,
  },
  settingsTitle: { fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '30px', marginLeft: '10px' },
  settingsMenuList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  settingsMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    borderRadius: '12px',
    background: '#f5f5f5',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  settingsMenuItemActive: { background: '#4371f0', color: 'white' },

  // Content Area
  contentArea: { flex: 1, marginLeft: '630px', padding: '40px 60px', zIndex: 10 },
  content: { maxWidth: '800px' },
  contentTitle: { fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '35px' },

  // Success/Error Messages
  successMessage: {
    background: '#d4edda',
    color: '#155724',
    padding: '14px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '15px',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '14px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '15px',
    border: '1px solid #f5c6cb'
  },

  // Profile Photo Section
  profilePhotoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    background: '#f5f7fa',
    borderRadius: '16px',
    marginBottom: '35px',
  },
  profilePhoto: { width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 },
  profileInfo: { flex: 1 },
  profileName: { margin: 0, fontSize: '18px', fontWeight: '600', color: '#111' },
  photoButton: {
    padding: '10px 24px',
    background: '#4371f0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  // Form
  form: {},
  formGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '8px' },
  input: {
    width: '100%',
    padding: '14px 18px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#333',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
    background: '#f5f7fa',
  },
  textarea: {
    width: '100%',
    padding: '14px 18px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#333',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
    background: '#f5f7fa',
  },
  select: {
    width: '100%',
    padding: '14px 18px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#333',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
    background: '#f5f7fa',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23666' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 18px center',
    paddingRight: '45px',
  },
  submitButton: {
    padding: '14px 40px',
    background: '#4371f0',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '10px',
  },

  // Notifications
  notificationList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  notificationItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    background: '#f5f7fa',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  notificationText: { fontSize: '15px', fontWeight: '500', color: '#333' },

  // Placeholder
  placeholderText: { fontSize: '15px', color: '#999', marginTop: '20px' },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f0f0f0',
    borderTop: '5px solid #4371f0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};
