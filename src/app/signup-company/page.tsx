'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupCompany() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    username: '',
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup data:', formData);
    alert('Sign up successful! (This is a demo)');
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, 40px) rotate(180deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, 30px); }
          66% { transform: translate(-30px, -20px); }
        }
      `}</style>

      {/* Background Circles */}
      <div style={{ ...styles.circle, top: '-120px', left: '-150px', width: '420px', height: '420px', background: '#2E5CB8', animation: 'float1 22s ease-in-out infinite' }} />
      <div style={{ ...styles.circle, top: '40px', left: '60px', width: '220px', height: '220px', background: '#F0A8D0', animation: 'float2 18s ease-in-out infinite' }} />
      <div style={{ ...styles.circle, bottom: '-200px', left: '-200px', width: '500px', height: '500px', background: '#E873A7', animation: 'float3 24s ease-in-out infinite' }} />
      <div style={{ ...styles.circle, top: '-100px', right: '-150px', width: '420px', height: '420px', background: '#E873A7', animation: 'float2 20s ease-in-out infinite' }} />
      <div style={{ ...styles.circle, bottom: '-180px', right: '-180px', width: '550px', height: '550px', background: '#2E5CB8', animation: 'float1 26s ease-in-out infinite' }} />

      {/* Main Card */}
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

        {/* Toggle Buttons */}
        <div style={styles.toggleButtons}>
          <button
            style={styles.toggleBtn}
            onClick={() => router.push('/signup-kol')}
          >
            kol
          </button>
          <button style={{ ...styles.toggleBtn, ...styles.toggleBtnActive }}>
            company
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
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
          <input
            type="text"
            name="companyName"
            placeholder="company name"
            value={formData.companyName}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleInputChange}
            style={styles.input}
            required
          />

          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="agreeToTerms"
              id="terms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              style={styles.checkbox}
              required
            />
            <label htmlFor="terms" style={styles.checkboxLabel}>
              Agree to our{' '}
              <a href="/privacy-policy" style={styles.link}>
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/cookies-policy" style={styles.link}>
                Cookies Policy
              </a>
            </label>
          </div>

          <button type="submit" style={styles.button}>
            sign up
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================================
   ✨ STYLE SECTION ✨
   (Sudah dioptimasi biar mirip Figma)
================================ */
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
    opacity: 0.9,
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '450px',
    minHeight: '680px',
    background:
      'linear-gradient(180deg, rgba(233,241,255,0.98) 0%, rgba(244,234,255,0.97) 45%, rgba(255,228,241,0.97) 100%)',
    borderRadius: '40px',
    padding: '55px 45px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
  },
  toggleButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '35px',
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '25px',
    border: '1px solid #d9d9d9',
    background: 'rgba(255,255,255,0.85)',
    fontSize: '15px',
    fontWeight: '500',
    color: '#777',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  toggleBtnActive: {
    background: '#2E5CB8',
    color: '#fff',
    boxShadow: '0 4px 10px rgba(46,92,184,0.3)',
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '20px 24px',
    marginBottom: '22px',
    borderRadius: '18px',
    border: '1px solid #eee',
    background: 'white',
    fontSize: '16px',
    color: '#333',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    boxSizing: 'border-box',
  },
  checkboxGroup: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // ✨ Biar center di tengah
  gap: '10px',
  marginBottom: '25px',
  textAlign: 'center',       // ✨ Tambahan biar label ikut rata tengah
},
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#777',
    lineHeight: '1.6',
  },
  link: {
    color: '#E873A7',
    textDecoration: 'underline',
  },
  button: {
    width: '100%',
    padding: '20px',
    borderRadius: '18px',
    border: 'none',
    background: 'linear-gradient(135deg, #E873A7 0%, #EC4899 100%)',
    color: 'white',
    fontSize: '17px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(236,72,153,0.3)',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  },
};