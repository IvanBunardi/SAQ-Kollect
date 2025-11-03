'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', formData);
    alert('Login successful! (This is a demo)');
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
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -25px) scale(1.1); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-15px, 15px); }
          75% { transform: translate(15px, -15px); }
        }
      `}</style>

      {/* Animated Background Circles */}
      <div style={{...styles.circle, top: '-100px', left: '-150px', width: '400px', height: '400px', background: '#2E5CB8', animation: 'float1 20s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, top: '-50px', left: '50px', width: '250px', height: '250px', background: '#F0A8D0', animation: 'float2 15s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, top: '150px', left: '-100px', width: '200px', height: '200px', background: '#A0C4E8', animation: 'float3 18s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, top: '380px', left: '80px', width: '80px', height: '80px', background: '#2E5CB8', animation: 'float4 12s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, top: '500px', left: '100px', width: '120px', height: '120px', background: '#E873A7', animation: 'float5 14s ease-in-out infinite'}}></div>
      
      <div style={{...styles.circle, top: '-120px', right: '-100px', width: '450px', height: '450px', background: '#E873A7', animation: 'float2 22s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, top: '20px', right: '50px', width: '150px', height: '150px', background: '#A0C4E8', animation: 'float3 16s ease-in-out infinite'}}></div>
      
      <div style={{...styles.circle, bottom: '-200px', left: '-150px', width: '500px', height: '500px', background: '#E873A7', animation: 'float1 25s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, bottom: '-100px', left: '50px', width: '350px', height: '350px', background: '#2E5CB8', animation: 'float4 19s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, bottom: '100px', left: '150px', width: '200px', height: '200px', background: '#D095BC', animation: 'float5 17s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, bottom: '200px', left: '300px', width: '150px', height: '150px', background: '#A0C4E8', animation: 'float2 13s ease-in-out infinite'}}></div>
      
      <div style={{...styles.circle, bottom: '-180px', right: '-200px', width: '600px', height: '600px', background: '#E873A7', animation: 'float3 24s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, bottom: '0px', right: '100px', width: '250px', height: '250px', background: '#2E5CB8', animation: 'float1 21s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, bottom: '150px', right: '200px', width: '180px', height: '180px', background: '#E8E8E8', animation: 'float4 15s ease-in-out infinite'}}></div>
      <div style={{...styles.circle, bottom: '250px', right: '50px', width: '130px', height: '130px', background: '#E873A7', animation: 'float5 11s ease-in-out infinite'}}></div>

      {/* Main Card */}
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <Image src="/assets/logo-full.png" alt="Kollect" width={400} height={175} style={{objectFit: 'contain'}} />
        </div>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" style={styles.button}>
            log in
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
    width: '400px',           // lebih ramping
    minHeight: '500px',       // lebih tinggi ke atas
    background:
      'linear-gradient(180deg, rgba(235,242,255,0.98) 0%, rgba(245,232,252,0.96) 50%, rgba(255,228,240,0.96) 100%)',
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
  boxSizing: 'border-box', // penting supaya padding ikut hitung lebar total
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
  boxSizing: 'border-box',
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
    color: '#828282ff',
  },
  linkBold: {
    color: '#E873A7',
    textDecoration: 'underline',
    fontWeight: '600',
  },
};