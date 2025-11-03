'use client';
import { useState, useEffect } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState('show-full');

  useEffect(() => {
    setTimeout(() => setStage('logo-only'), 1500);
    setTimeout(() => onFinish(), 3000);
  }, []);

  return (
    <div className="splash">
      <img src="/assets/logo-full.png" className={`logo-full ${stage}`} />
      <img src="/assets/logo-icon.png" className={`logo-icon ${stage}`} />
    </div>
  );
}