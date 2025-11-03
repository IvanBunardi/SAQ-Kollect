'use client';
import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    // redirect ke file HTML static di public/
    window.location.href = '/privacy-policy.html';
  }, []);

  return null;
}