import React, { useState, useEffect } from 'react';

// Leaf SVG for top right corner
const LeafIcon = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 25 C65 25, 80 40, 80 57 C80 65, 75 75, 68 82 C65 75, 62 60, 48 50 C38 42, 28 40, 20 42 C22 35, 30 25, 48 25 Z" fill="#bae6fd" />
    <path d="M35 55 C45 55, 55 65, 55 75 C55 80, 50 88, 45 92 C43 88, 40 75, 30 68 C23 62, 15 60, 10 62 C12 58, 20 55, 35 55 Z" fill="#a7f3d0" />
  </svg>
);

export const SplashScreen = ({ onFinish }) => {
  const [fade, setFade] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2; // fills up in ~4 seconds (50 steps * 80ms)
      });
    }, 80);

    // Auto-dismiss after 4.5s
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 400); // Wait for fade transition
    }, 4500);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'radial-gradient(circle at center, #ffffff 0%, #f0f9ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      opacity: fade ? 0 : 1,
      visibility: fade ? 'hidden' : 'visible',
      transition: 'opacity 0.4s ease, visibility 0.4s ease',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* Top Left Wave Decoration */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '40vw',
        height: '40vw',
        background: '#e0f2fe',
        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
        opacity: 0.6,
        transform: 'rotate(20deg)',
        zIndex: 0
      }} />

      {/* Bottom Right Wave Decoration */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        background: '#e0f2fe',
        borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
        opacity: 0.7,
        transform: 'rotate(-15deg)',
        zIndex: 0
      }} />

      {/* Top Right Leaf Icon */}
      <div style={{ position: 'absolute', top: 40, right: 50, zIndex: 1, opacity: 0.8 }}>
        <LeafIcon />
      </div>

      {/* Faded Background Image (Village/Rural) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40vh',
        background: 'url(/splash-poster.jpg) center bottom / cover no-repeat', // Using existing rural image
        opacity: 0.12,
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
        zIndex: 0,
        filter: 'grayscale(30%)'
      }} />

      {/* Center Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
          <img 
            src="/ek-asha-logo-transparent.png" 
            alt="EK ASHA Logo" 
            style={{ width: 100, height: 100, objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(2,132,199,0.15))' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f2942', lineHeight: 1.1, letterSpacing: '-0.5px' }}>EK ASHA</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#0284c7', lineHeight: 1.2 }}>Healthcare Platform</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 500, marginBottom: 40, letterSpacing: '0.3px' }}>
          Right Patient. Right Priority. Right Route.
        </div>

        {/* Loading Bar Container */}
        <div style={{ width: 260, height: 8, background: '#e0f2fe', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, #3b82f6, #0284c7)', 
            width: `${progress}%`,
            borderRadius: 10,
            transition: 'width 0.1s linear'
          }} />
        </div>

        {/* Loading Text */}
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
          Loading...
        </div>

      </div>

    </div>
  );
};
