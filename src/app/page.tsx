'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [stage, setStage] = useState('show-full');

  useEffect(() => {
    // Text hilang, logo aja yang muncul (1.5 detik)
    setTimeout(() => setStage('logo-only'), 1500);
    
    // Splash selesai, redirect ke signup (3.5 detik)
    setTimeout(() => {
      setShowSplash(false);
      router.push('/signup-kol');
    }, 3500);
  }, [router]);

  if (showSplash) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{ 
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Logo + Text */}
          <img 
            src="/assets/logo-full.png"
            alt="Kollect"
            style={{
              height: 120,
              opacity: stage === 'show-full' ? 1 : 0,
              transition: 'opacity 0.8s ease',
              position: stage === 'logo-only' ? 'absolute' : 'relative'
            }}
          />
          
          {/* Logo Icon aja */}
          <img 
            src="/assets/logo-icon.png"
            alt="Kollect"
            style={{
              height: stage === 'logo-only' ? 100 : 0,
              opacity: stage === 'logo-only' ? 1 : 0,
              transition: 'all 0.8s ease',
              position: 'absolute'
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}