'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('create');
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | 'story' | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    caption: '',
    location: '',
    taggedPeople: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTypeSelect = (type: 'photo' | 'video' | 'story') => {
    setSelectedType(type);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 100) {
        setError(`File too large: ${fileSizeMB.toFixed(2)}MB. Max 100MB.`);
        return;
      }

      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    setSelectedType(null);
    setUploadedImage(null);
    setUploadedFile(null);
    setFormData({ caption: '', location: '', taggedPeople: '' });
    setError('');
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !selectedType) {
      setError('Please upload a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', uploadedFile);
      formDataToSend.append('type', selectedType);
      formDataToSend.append('caption', formData.caption);
      formDataToSend.append('location', formData.location);
      
      // Parse tagged people (comma separated)
      if (formData.taggedPeople) {
        const tags = formData.taggedPeople.split(',').map(tag => tag.trim());
        formDataToSend.append('taggedPeople', JSON.stringify(tags));
      }

      console.log('Sending request to /api/post/create...');

      const res = await fetch('/api/post/create', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include', // Important untuk cookies
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      // Check content type
      const contentType = res.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        // Server returned HTML instead of JSON
        const text = await res.text();
        console.error('Server returned HTML:', text.substring(0, 200));
        
        setError('Server error: Expected JSON but got HTML. Check if API route exists.');
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || `Server error: ${res.status}`);
        setLoading(false);
        return;
      }

      alert('Post created successfully!');
      router.push('/feeds');
    } catch (err: any) {
      console.error('Create post error:', err);
      setError(`Network error: ${err.message}`);
      setLoading(false);
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
            <Link href="/notifications" style={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>Notifications</span>
            </Link>
            <Link href="/create" style={{...styles.navItem, ...(activeNav === 'create' && styles.navItemActive)}}>
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
          {!selectedType ? (
            // Initial Selection View
            <>
              <h1 style={styles.pageTitle}>Create</h1>
              <h2 style={styles.subtitle}>What do you want to share today?</h2>
              
              <div style={styles.optionsGrid}>
                {/* Photo Option */}
                <div style={styles.optionCard} onClick={() => handleTypeSelect('photo')}>
                  <div style={{...styles.optionIcon, background: '#a5c8f0'}}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <h3 style={styles.optionTitle}>Photo</h3>
                </div>

                {/* Video Option */}
                <div style={styles.optionCard} onClick={() => handleTypeSelect('video')}>
                  <div style={{...styles.optionIcon, background: '#f4a3c8'}}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7"/>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                  </div>
                  <h3 style={styles.optionTitle}>Video</h3>
                </div>

                {/* Story Option */}
                <div style={styles.optionCard} onClick={() => handleTypeSelect('story')}>
                  <div style={{...styles.optionIcon, background: '#d4d4d4'}}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <h3 style={styles.optionTitle}>Story</h3>
                </div>
              </div>
            </>
          ) : (
            // Create New Post View
            <div style={styles.createContainer}>
              <div style={styles.createHeader}>
                <button style={styles.backButton} onClick={handleBack}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                </button>
                <h1 style={styles.createTitle}>Create New Post</h1>
              </div>

              {error && (
                <div style={styles.errorBox}>
                  {error}
                </div>
              )}

              <div style={styles.createContent}>
                {/* Preview Section */}
                <div style={styles.previewSection}>
                  <h2 style={styles.sectionTitle}>Preview</h2>
                  <div style={styles.previewBox}>
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Preview" style={styles.previewImage} />
                    ) : (
                      <label style={styles.uploadLabel}>
                        <input 
                          type="file" 
                          accept="image/*,video/*" 
                          style={styles.fileInput}
                          onChange={handleImageUpload}
                        />
                        <div style={styles.uploadIcon}>
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <p style={styles.uploadText}>Upload {selectedType}</p>
                        <p style={styles.uploadSubtext}>Click or drag and drop</p>
                      </label>
                    )}
                  </div>
                </div>

                {/* Form Section */}
                <div style={styles.formSection}>
                  <h2 style={styles.sectionTitle}>Create New Post</h2>
                  
                  {/* Caption */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Caption</label>
                    <textarea 
                      name="caption"
                      value={formData.caption}
                      onChange={handleInputChange}
                      style={styles.textarea}
                      placeholder="Write Your Caption"
                      rows={4}
                    />
                  </div>

                  {/* Location */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Location</label>
                    <div style={styles.inputWithIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <input 
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Add location"
                      />
                    </div>
                  </div>

                  {/* Tag People */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Tag People</label>
                    <div style={styles.inputWithIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <input 
                        type="text"
                        name="taggedPeople"
                        value={formData.taggedPeople}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Tag people (comma separated)"
                      />
                    </div>
                  </div>

                  {/* Share Post Button */}
                  <button 
                    style={{
                      ...styles.shareButton,
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Share Post'}
                  </button>
                </div>
              </div>
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
  pageTitle: { fontSize: '38px', fontWeight: '700', color: '#111', marginBottom: '15px' },
  subtitle: { fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '40px' },

  // Options Grid (Initial View)
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', maxWidth: '900px', marginTop: '40px' },
  optionCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid #f0f0f0',
    minHeight: '280px',
  },
  optionIcon: {
    width: '120px',
    height: '120px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  optionTitle: { fontSize: '20px', fontWeight: '600', color: '#111', margin: 0 },

  // Create New Post View
  createContainer: { maxWidth: '1200px' },
  createHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px' },
  backButton: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  createTitle: { fontSize: '28px', fontWeight: '700', color: '#111', margin: 0 },
  
  errorBox: {
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#c33',
    marginBottom: '20px',
    fontSize: '14px',
  },

  createContent: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
  
  // Preview Section
  previewSection: {},
  sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '16px' },
  previewBox: {
    background: '#e8f4f8',
    borderRadius: '16px',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '40px',
  },
  fileInput: { display: 'none' },
  uploadIcon: { marginBottom: '16px' },
  uploadText: { fontSize: '18px', fontWeight: '600', color: '#333', margin: '8px 0' },
  uploadSubtext: { fontSize: '14px', color: '#666', margin: 0 },
  previewImage: { width: '100%', height: '100%', objectFit: 'cover' },

  // Form Section
  formSection: {},
  formGroup: { marginBottom: '24px' },
  formLabel: { display: 'block', fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '8px' },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
  },
  inputWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '10px',
    transition: 'border 0.2s',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#333',
    background: 'transparent',
  },
  shareButton: {
    width: '100%',
    padding: '16px',
    background: '#4371f0',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '16px',
  },
};