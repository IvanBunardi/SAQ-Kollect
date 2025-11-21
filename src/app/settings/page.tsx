'use client';

import { useState, useEffect, useRef } from 'react';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from "../../components/LanguageProvider";

export default function SettingsPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeNav, setActiveNav] = useState<string>('settings');
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('edit-profil');
  const [selectedGender, setSelectedGender] = useState<string>('Memilih tidak memberi tahu');
  
  
  type User = {
    fullname?: string;
    username?: string;
    website?: string;
    bio?: string;
    gender?: string;
    profilePhoto?: string | null;
    email?: string;
  };

  // User data state
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [photoLoading, setPhotoLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');

  // Language state
  const [selectedLanguage, setSelectedLanguageState] = useState<string>(language);
  const [languageLoading, setLanguageLoading] = useState<boolean>(false);

  // Notification state
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    campaigns: true,
    messages: true,
    email: true,
    push: true
  });
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false);

  // Privacy state
  const [privacySettings, setPrivacySettings] = useState({
    isPrivate: false,
    showActivity: true,
    showEmail: false
  });
  const [privacyLoading, setPrivacyLoading] = useState<boolean>(false);

  // Blocked users state
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [blockedLoading, setBlockedLoading] = useState<boolean>(false);

  // Close friends state
  const [closeFriends, setCloseFriends] = useState<any[]>([]);
  const [closeFriendsLoading, setCloseFriendsLoading] = useState<boolean>(false);

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
    console.log('🚀 Settings page mounted, fetching user profile...');
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch respective data when tab changes
  useEffect(() => {
    if (activeSettingsTab === 'language') fetchLanguage();
    if (activeSettingsTab === 'notifications') fetchNotificationSettings();
    if (activeSettingsTab === 'account-privacy') fetchPrivacySettings();
    if (activeSettingsTab === 'blocked') fetchBlockedUsers();
    if (activeSettingsTab === 'close-friend') fetchCloseFriends();
  }, [activeSettingsTab]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Token from localStorage:', token ? token.substring(0, 30) + '...' : 'null');
      
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('📡 Fetching profile with token...');
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Response status:', response.status);
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
        console.log('✅ User data loaded successfully:', u.username);
      } else {
        setError(data.message || t('failedLoadProfile'));
        console.error('❌ API error:', data.message);
        
        if (response.status === 401) {
          console.log('🔐 Token invalid, clearing and redirecting to login');
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    } catch (err) {
      console.error('❌ Profile fetch error:', err);
      setError(t('failedLoadProfile'));
    } finally {
      setLoading(false);
    }
  };

  // Language functions
  const fetchLanguage = async () => {
    try {
      const response = await fetch('/api/settings/language', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSelectedLanguageState(data.language);
      }
    } catch (err) {
      console.error('❌ Error fetching language:', err);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguageLoading(true);
    try {
      const response = await fetch('/api/settings/language', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ language: newLanguage })
      });
      const data = await response.json();
      if (data.success) {
        setSelectedLanguageState(newLanguage);
        setSaveSuccess(t('languageUpdated'));
        setTimeout(() => setSaveSuccess(''), 3000);
        // Call setLanguage to update global language
        setLanguage(newLanguage as any);
      }
    } catch (err) {
      console.error('❌ Error updating language:', err);
      setSaveError(t('failedUpdateLanguage'));
      setTimeout(() => setSaveError(''), 3000);
    } finally {
      setLanguageLoading(false);
    }
  };

  // Notification functions
  const fetchNotificationSettings = async () => {
    try {
      setNotificationLoading(true);
      const response = await fetch('/api/settings/notifications', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setNotificationSettings(data.notificationSettings);
      }
    } catch (err) {
      console.error('❌ Error fetching notifications:', err);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationToggle = async (key: string) => {
    const newSettings = { ...notificationSettings, [key]: !notificationSettings[key as keyof typeof notificationSettings] };
    setNotificationSettings(newSettings);

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notificationSettings: newSettings })
      });
      const data = await response.json();
      if (data.success) {
        setSaveSuccess(t('notificationSettingsUpdated'));
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      console.error('❌ Error updating notifications:', err);
      setSaveError(t('failedUpdateNotifications'));
      setTimeout(() => setSaveError(''), 3000);
    }
  };

  // Privacy functions
  const fetchPrivacySettings = async () => {
    try {
      setPrivacyLoading(true);
      const response = await fetch('/api/settings/privacy', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setPrivacySettings(data.privacySettings);
      }
    } catch (err) {
      console.error('❌ Error fetching privacy settings:', err);
    } finally {
      setPrivacyLoading(false);
    }
  };

  const handlePrivacyToggle = async (key: string) => {
    const newSettings = { ...privacySettings, [key]: !privacySettings[key as keyof typeof privacySettings] };
    setPrivacySettings(newSettings);

    try {
      const response = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSettings)
      });
      const data = await response.json();
      if (data.success) {
        setSaveSuccess(t('privacySettingsUpdated'));
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      console.error('❌ Error updating privacy:', err);
      setSaveError(t('failedUpdatePrivacy'));
      setTimeout(() => setSaveError(''), 3000);
    }
  };

  // Blocked users functions
  const fetchBlockedUsers = async () => {
    try {
      setBlockedLoading(true);
      const response = await fetch('/api/settings/blocked', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setBlockedUsers(data.blockedUsers);
      }
    } catch (err) {
      console.error('❌ Error fetching blocked users:', err);
    } finally {
      setBlockedLoading(false);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/settings/blocked?userId=${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setBlockedUsers(blockedUsers.filter(u => u._id !== userId));
        setSaveSuccess(t('userUnblocked'));
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      console.error('❌ Error unblocking user:', err);
      setSaveError(t('failedUnblockUser'));
      setTimeout(() => setSaveError(''), 3000);
    }
  };

  // Close friends functions
  const fetchCloseFriends = async () => {
    try {
      setCloseFriendsLoading(true);
      const response = await fetch('/api/settings/close-friends', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCloseFriends(data.closeFriends);
      }
    } catch (err) {
      console.error('❌ Error fetching close friends:', err);
    } finally {
      setCloseFriendsLoading(false);
    }
  };

  const handleRemoveCloseFriend = async (userId: string) => {
    try {
      const response = await fetch(`/api/settings/close-friends?userId=${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCloseFriends(closeFriends.filter(u => u._id !== userId));
        setSaveSuccess(t('closeFriendRemoved'));
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      console.error('❌ Error removing close friend:', err);
      setSaveError(t('failedRemoveCloseFriend'));
      setTimeout(() => setSaveError(''), 3000);
    }
  };

  // Export data function
  const handleExportData = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/settings/export?format=${format}&type=all`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kollect_data_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSaveSuccess(format === 'json' ? t('dataExportedJSON') : t('dataExportedCSV'));
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error exporting data:', err);
      setSaveError(t('failedExportData'));
      setTimeout(() => setSaveError(''), 3000);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSaveError(t('tipeFlageTidakValid'));
      setTimeout(() => setSaveError(''), 3000);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setSaveError(t('ukuranFileTerlaluBesar'));
      setTimeout(() => setSaveError(''), 3000);
      return;
    }

    setPhotoLoading(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const photoFormData = new FormData();
      photoFormData.append('photo', file);

      console.log('📤 Uploading photo...');

      const response = await fetch('/api/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: photoFormData,
      });

      const data = await response.json();
      console.log('📦 Upload response:', data);

      if (data.success && data.user) {
        setUserData(data.user as User);
        setSaveSuccess(t('fotoBerhasilDiperbarui'));
        console.log('✅ Photo uploaded successfully');
        
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setSaveError(data.message || t('gagalMenguploadFoto'));
        console.error('❌ Upload error:', data.message);
      }
    } catch (err) {
      console.error('❌ Photo upload error:', err);
      setSaveError(t('gagalMenguploadFoto'));
    } finally {
      setPhotoLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm(t('apakahYakinMenghapus'))) {
      return;
    }

    setPhotoLoading(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('🗑️ Deleting photo...');

      const response = await fetch('/api/profile/photo', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('📦 Delete response:', data);

      if (data.success && data.user) {
        setUserData(data.user as User);
        setSaveSuccess(t('fotoBerhasilDihapus'));
        console.log('✅ Photo deleted successfully');
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setSaveError(data.message || t('gagalMenghapusFoto'));
        console.error('❌ Delete error:', data.message);
      }
    } catch (err) {
      console.error('❌ Photo delete error:', err);
      setSaveError(t('gagalMenghapusFoto'));
    } finally {
      setPhotoLoading(false);
    }
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
          bio: formData.bio,
          website: formData.website,
          gender: formData.gender,
        }),
      });

      const data = await response.json();
      console.log('📦 Update response:', data);

      if (data.success && data.user) {
        setUserData(data.user as User);
        setSaveSuccess(t('profilBerhasilDiperbarui'));
        console.log('✅ Profile updated successfully');
        
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setSaveError(data.message || t('gagalMemperbaruiProfil'));
        console.error('❌ Update error:', data.message);
      }
    } catch (err) {
      console.error('❌ Profile update error:', err);
      setSaveError(t('gagalMemperbaruiProfil'));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.btnPrimary} onClick={() => router.push('/login')}>
          {t('goToLogin')}
        </button>
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
              <span>{t('home')}</span>
            </Link>
            <Link href="/search" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span>{t('search')}</span>
            </Link>
            <Link href="/explore" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
              <span>{t('explore')}</span>
            </Link>
            <Link href="/messages" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>{t('messages')}</span>
            </Link>
            <Link href="/notifications" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>{t('notifications')}</span>
            </Link>
            <Link href="/create" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>{t('create')}</span>
            </Link>
            <Link href="/profile" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>{t('profile')}</span>
            </Link>
            <Link href="/work" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>{t('work')}</span>
            </Link>
            <Link href="/settings" style={{...styles.navItem, ...(activeNav === 'settings' && styles.navItemActive)}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
              </svg>
              <span>{t('settings')}</span>
            </Link>
            <button onClick={handleLogout} style={{...styles.navItem, marginTop: 'auto'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>{t('logout')}</span>
            </button>
          </nav>
          
          <div style={styles.sidebarDecoration}>
            <div style={{...styles.sidebarCircle, width: '100px', height: '100px', bottom: '20px', left: '-20px', background: '#4371f0'}}></div>
            <div style={{...styles.sidebarCircle, width: '80px', height: '80px', bottom: '80px', left: '30px', background: '#e357a3', animationDelay: '2s'}}></div>
          </div>
        </div>

        {/* Settings Menu Panel */}
        <div style={styles.settingsMenu}>
          <h2 style={styles.settingsTitle}>{t('pengaturan')}</h2>
          
          <div style={styles.settingsMenuList}>
            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'edit-profil' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('edit-profil')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>{t('editProfil')}</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'notifications' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('notifications')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>{t('notificationsMenu')}</span>
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
              <span>{t('accountPrivacy')}</span>
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
              <span>{t('closeFriend')}</span>
            </button>

            <button 
              style={{...styles.settingsMenuItem, ...(activeSettingsTab === 'blocked' && styles.settingsMenuItemActive)}}
              onClick={() => setActiveSettingsTab('blocked')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              <span>{t('blocked')}</span>
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
              <span>{t('archiving')}</span>
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
              <span>{t('language')}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {saveSuccess && <div style={styles.successMessage}>{saveSuccess}</div>}
          {saveError && <div style={styles.errorMessage}>{saveError}</div>}

          {activeSettingsTab === 'edit-profil' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>{t('editProfilTitle')}</h1>

              <div style={styles.profilePhotoSection}>
                <div style={styles.profilePhoto}>
                  {userData?.profilePhoto ? (
                    <img 
                      src={userData.profilePhoto} 
                      alt={userData?.username || 'User'} 
                      style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}}
                    />
                  ) : (
                    <Image 
                      src="/assets/logo-icon.png" 
                      alt={userData?.username || 'User'} 
                      width={70} 
                      height={70} 
                      style={{borderRadius: '50%', objectFit: 'cover'}} 
                    />
                  )}
                </div>
                <div style={styles.profileInfo}>
                  <h3 style={styles.profileName}>{userData?.username || t('loading')}</h3>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  style={{display: 'none'}}
                />
                <button 
                  style={{...styles.photoButton, opacity: photoLoading ? 0.6 : 1}}
                  onClick={handlePhotoClick}
                  disabled={photoLoading}
                >
                  {photoLoading ? t('uploading') : t('ubahFoto')}
                </button>
                {userData?.profilePhoto && (
                  <button 
                    style={{...styles.photoButtonRemove, opacity: photoLoading ? 0.6 : 1}}
                    onClick={handleRemovePhoto}
                    disabled={photoLoading}
                  >
                    {t('hapusFoto')}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('name')}</label>
                  <input 
                    type="text" 
                    name="fullname"
                    style={styles.input}
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder={t('name')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('username')}</label>
                  <input 
                    type="text" 
                    name="username"
                    style={styles.input}
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={t('username')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('website')}</label>
                  <input 
                    type="text" 
                    name="website"
                    style={styles.input}
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder={t('website')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('bio')}</label>
                  <textarea 
                    name="bio"
                    style={styles.textarea}
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder={t('bio')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('gender')}</label>
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
                  {saveLoading ? t('menyimpan') : t('kirim')}
                </button>
              </form>
            </div>
          )}

          {activeSettingsTab === 'notifications' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>{t('notificationSettingsTitle')}</h1>

              {notificationLoading ? (
                <p>{t('loading')}</p>
              ) : (
                <div style={styles.notificationList}>
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} style={styles.notificationItem}>
                      <span style={styles.notificationText}>
                        {t(`${key}Notifications`)}
                      </span>
                      <div style={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleNotificationToggle(key)}
                          style={{width: '20px', height: '20px', cursor: 'pointer'}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSettingsTab === 'account-privacy' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>{t('accountPrivacyTitle')}</h1>

              {privacyLoading ? (
                <p>{t('loading')}</p>
              ) : (
                <div style={styles.notificationList}>
                  <div style={styles.notificationItem}>
                    <div>
                      <span style={styles.notificationText}>{t('privateAccount')}</span>
                      <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#999'}}>{t('privateAccountDesc')}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.isPrivate}
                      onChange={() => handlePrivacyToggle('isPrivate')}
                      style={{width: '20px', height: '20px', cursor: 'pointer'}}
                    />
                  </div>

                  <div style={styles.notificationItem}>
                    <div>
                      <span style={styles.notificationText}>{t('showActivityStatus')}</span>
                      <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#999'}}>{t('showActivityDesc')}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showActivity}
                      onChange={() => handlePrivacyToggle('showActivity')}
                      style={{width: '20px', height: '20px', cursor: 'pointer'}}
                    />
                  </div>

                  <div style={styles.notificationItem}>
                    <div>
                      <span style={styles.notificationText}>{t('showEmailAddress')}</span>
                      <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#999'}}>{t('showEmailDesc')}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={() => handlePrivacyToggle('showEmail')}
                      style={{width: '20px', height: '20px', cursor: 'pointer'}}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSettingsTab === 'close-friend' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>{t('closeFriendTitle')}</h1>

              {closeFriendsLoading ? (
                <p>{t('loading')}</p>
              ) : closeFriends.length === 0 ? (
                <p style={styles.placeholderText}>{t('closeFriendDesc')}</p>
              ) : (
                <div style={styles.userList}>
                  {closeFriends.map(friend => (
                    <div key={friend._id} style={styles.userItem}>
                      <img src={friend.profilePhoto || `https://ui-avatars.com/api/?name=${friend.fullname}`} alt={friend.fullname} style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                      <div style={{flex: 1}}>
                        <p style={{margin: 0, fontWeight: '600'}}>{friend.fullname}</p>
                        <p style={{margin: '2px 0 0 0', fontSize: '12px', color: '#999'}}>@{friend.username}</p>
                      </div>
                      <button style={styles.removeBtn} onClick={() => handleRemoveCloseFriend(friend._id)}>{t('remove')}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSettingsTab === 'blocked' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>{t('blockedTitle')}</h1>

              {blockedLoading ? (
                <p>{t('loading')}</p>
              ) : blockedUsers.length === 0 ? (
                <p style={styles.placeholderText}>{t('blockedDesc')}</p>
              ) : (
                <div style={styles.userList}>
                  {blockedUsers.map(user => (
                    <div key={user._id} style={styles.userItem}>
                      <img src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.fullname}`} alt={user.fullname} style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                      <div style={{flex: 1}}>
                        <p style={{margin: 0, fontWeight: '600'}}>{user.fullname}</p>
                        <p style={{margin: '2px 0 0 0', fontSize: '12px', color: '#999'}}>@{user.username}</p>
                      </div>
                      <button style={styles.unblockBtn} onClick={() => handleUnblockUser(user._id)}>{t('unblock')}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSettingsTab === 'archiving' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>{t('archivingTitle')}</h1>

              <div style={styles.archiveSection}>
                <h3 style={{marginTop: 0}}>{t('downloadYourData')}</h3>
                <p style={{color: '#666', marginBottom: '20px'}}>{t('downloadDataDesc')}</p>
                
                <div style={{display: 'flex', gap: '12px'}}>
                  <button 
                    style={{...styles.downloadBtn, ...{background: '#4371f0'}}}
                    onClick={() => handleExportData('json')}
                  >
                    {t('downloadAsJSON')}
                  </button>
                  <button 
                    style={{...styles.downloadBtn, ...{background: '#27ae60'}}}
                    onClick={() => handleExportData('csv')}
                  >
                    {t('downloadAsCSV')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'language' && (
            <div style={styles.content}>
              <h1 style={styles.contentTitle}>{t('languageTitle')}</h1>

              <div style={styles.languageSection}>
                <label style={styles.label}>{t('selectLanguage')}</label>
                <select 
                  style={{...styles.select, marginTop: '12px'}}
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  disabled={languageLoading}
                >
                  <option value="en">{t('english')}</option>
                  <option value="id">{t('indonesian')}</option>
                  <option value="es">{t('spanish')}</option>
                  <option value="fr">{t('french')}</option>
                  <option value="de">{t('german')}</option>
                  <option value="ja">{t('japanese')}</option>
                  <option value="zh">{t('chinese')}</option>
                </select>
                {languageLoading && <p style={{fontSize: '12px', color: '#999', marginTop: '8px'}}>{t('updating')}</p>}
              </div>
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

  contentArea: { flex: 1, marginLeft: '630px', padding: '40px 60px', zIndex: 10, overflowY: 'auto' as const },
  content: { maxWidth: '800px' },
  contentTitle: { fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '35px' },

  successMessage: {
    background: '#d4edda',
    color: '#155724',
    padding: '14px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '15px',
    border: '1px solid #c3e6cb',
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 1000,
    maxWidth: '400px'
  },
  errorMessage: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '14px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '15px',
    border: '1px solid #f5c6cb',
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 1000,
    maxWidth: '400px'
  },

  profilePhotoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '25px',
    background: '#f5f7fa',
    borderRadius: '16px',
    marginBottom: '35px',
  },
  profilePhoto: { 
    width: '70px', 
    height: '70px', 
    borderRadius: '50%', 
    overflow: 'hidden', 
    flexShrink: 0,
    border: '2px solid #e0e0e0'
  },
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
  photoButtonRemove: {
    padding: '10px 24px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

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
    boxSizing: 'border-box' as const,
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
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    transition: 'border 0.2s',
    boxSizing: 'border-box' as const,
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
    boxSizing: 'border-box' as const,
    background: '#f5f7fa',
    cursor: 'pointer',
    appearance: 'none' as const,
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
  toggle: { display: 'flex', alignItems: 'center' },

  placeholderText: { fontSize: '15px', color: '#999', marginTop: '20px' },

  userList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#f5f7fa',
    borderRadius: '12px'
  },
  removeBtn: {
    padding: '6px 16px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  unblockBtn: {
    padding: '6px 16px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  archiveSection: {
    padding: '20px',
    background: '#f5f7fa',
    borderRadius: '12px',
    marginBottom: '20px'
  },
  downloadBtn: {
    padding: '12px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  languageSection: { padding: '20px', background: '#f5f7fa', borderRadius: '12px' },

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
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
    padding: '20px'
  },
  errorText: { fontSize: '18px', color: '#e74c3c', textAlign: 'center' as const },
  btnPrimary: {
    padding: '12px 28px',
    background: '#e357a3',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
};