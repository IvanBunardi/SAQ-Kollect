'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with:', formData.email);
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('📦 Login response:', data);

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // ✅ SAVE TOKEN TO LOCALSTORAGE - INI YANG PENTING!
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('✅ Token saved to localStorage:', data.token.substring(0, 30) + '...');
      } else {
        console.warn('⚠️ No token in response!');
        setError('Login failed: No token received');
        setLoading(false);
        return;
      }

      // Save user data for UI purposes
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ User data saved:', data.user.username);
      }

      console.log('✅ Login successful! Redirecting...');
      
      // Show success message
      alert('Login successful!');
      
      // Redirect to feeds page
      router.push('/feeds');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animasi background */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }
      `}</style>

      <div style={{
        ...styles.circle,
        top: '-100px',
        left: '-150px',
        width: '400px',
        height: '400px',
        background: '#2E5CB8',
        animation: 'float1 20s ease-in-out infinite'
      }}></div>
      <div style={{
        ...styles.circle,
        bottom: '-150px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: '#E873A7',
        animation: 'float2 18s ease-in-out infinite'
      }}></div>

      <div style={styles.card}>
        <div style={styles.logoSection}>
          <Image 
            src="/assets/logo-full.png" 
            alt="Kollect" 
            width={400} 
            height={175} 
            style={{ objectFit: 'contain' }} 
          />
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'log in'}
          </button>
        </form>

        <div style={styles.forgotPassword}>
          <a href="/forgot-password" style={styles.link}>forgot password?</a>
        </div>

        <div style={styles.signupText}>
          don't have an account? <a href="/signup-kol" style={styles.linkBold}>sign up</a>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '400px',
    minHeight: '500px',
    background: 'linear-gradient(180deg, rgba(235,242,255,0.98) 0%, rgba(245,232,252,0.96) 50%, rgba(255,228,240,0.96) 100%)',
    borderRadius: '35px',
    padding: '60px 45px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
  },
  input: {
    width: '100%',
    padding: '18px 24px',
    marginBottom: '20px',
    borderRadius: '14px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    fontSize: '16px',
    color: '#555',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '18px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #E873A7 0%, #EC4899 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '10px',
    padding: '10px',
    background: '#ffebee',
    borderRadius: '8px',
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: '25px',
  },
  link: {
    fontSize: '14px',
    color: '#E873A7',
    textDecoration: 'underline',
  },
  signupText: {
    textAlign: 'center',
    marginTop: '18px',
    fontSize: '15px',
    color: '#828282',
  },
  linkBold: {
    color: '#E873A7',
    textDecoration: 'underline',
    fontWeight: '600',
  },
};