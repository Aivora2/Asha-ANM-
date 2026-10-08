import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

/* ─── SVG ICONS inlined (Rajasthan Emblem, Anganwadi logo surrogates) ─── */
const EmblemIcon = () => (
  <svg viewBox="0 0 80 80" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" fill="#1a3a6b" stroke="#c8a94f" strokeWidth="2.5"/>
    <circle cx="40" cy="40" r="30" fill="none" stroke="#c8a94f" strokeWidth="1"/>
    <text x="40" y="28" textAnchor="middle" fontSize="9" fill="#c8a94f" fontWeight="bold">सत्यमेव</text>
    <text x="40" y="38" textAnchor="middle" fontSize="9" fill="#c8a94f" fontWeight="bold">जयते</text>
    <path d="M20 50 Q40 42 60 50" stroke="#c8a94f" fill="none" strokeWidth="1.5"/>
    <circle cx="40" cy="47" r="4" fill="#c8a94f"/>
    <path d="M28 52 L32 60 M40 52 L40 61 M52 52 L48 60" stroke="#c8a94f" strokeWidth="1.2" fill="none"/>
  </svg>
);

const AnganwadiIcon = () => (
  <svg viewBox="0 0 72 72" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="35" fill="#0e4f8b" stroke="#f4c430" strokeWidth="2"/>
    <ellipse cx="36" cy="28" rx="14" ry="14" fill="none" stroke="#f4c430" strokeWidth="1.5"/>
    <path d="M22 28 A14 14 0 0 1 50 28" fill="#f4c430" opacity="0.3"/>
    <path d="M26 32 Q36 20 46 32" fill="#f4c430" opacity="0.7"/>
    <circle cx="36" cy="26" r="5" fill="#f4c430"/>
    <text x="36" y="52" textAnchor="middle" fontSize="6.5" fill="#f4c430" fontWeight="bold">सशक्त</text>
    <text x="36" y="60" textAnchor="middle" fontSize="6.5" fill="#f4c430" fontWeight="bold">आंगनवाड़ी</text>
  </svg>
);

/* ─── Rajasthan map SVG path (simplified) ─── */
const RajasthanMapSVG = ({ animated }) => (
  <svg viewBox="0 0 280 260" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d9e8f7"/>
        <stop offset="100%" stopColor="#b8d4ef"/>
      </linearGradient>
      <filter id="mapShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(2,132,199,0.2)"/>
      </filter>
    </defs>
    {/* Rajasthan simplified outline */}
    <path
      d="M50 30 L90 15 L140 20 L185 10 L230 30 L245 70 L250 110 L240 150 L220 180 L200 210 L170 235 L140 245 L100 240 L70 220 L45 195 L30 160 L25 120 L30 80 Z"
      fill="url(#mapGrad)"
      stroke="#0284c7"
      strokeWidth="2"
      filter="url(#mapShadow)"
      opacity="0.9"
    />
    {/* Internal district borders, subtle */}
    <path d="M50 30 L120 80 L200 60 M120 80 L100 160 M120 80 L200 140 M100 160 L200 140 L220 180" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="4 4" fill="none" opacity="0.5"/>

    {/* Jaipur pin (capital) */}
    <g transform="translate(130,95)">
      <circle r="10" fill="#0284c7" opacity="0.2">
        {animated && <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite"/>}
      </circle>
      <path d="M0-12 C-5-12 -8-7 -8-3 C-8 3 0 12 0 12 C0 12 8 3 8-3 C8-7 5-12 0-12Z" fill="#0284c7"/>
      <circle cy="-3" r="3.5" fill="white"/>
    </g>

    {/* Jodhpur pin */}
    <g transform="translate(82,130)">
      <circle r="8" fill="#ea580c" opacity="0.2">
        {animated && <animate attributeName="r" values="5;10;5" dur="2.5s" repeatCount="indefinite"/>}
      </circle>
      <path d="M0-9 C-4-9 -6-5 -6-2 C-6 2 0 9 0 9 C0 9 6 2 6-2 C6-5 4-9 0-9Z" fill="#ea580c"/>
      <circle cy="-2" r="2.5" fill="white"/>
    </g>

    {/* Udaipur pin */}
    <g transform="translate(145,190)">
      <path d="M0-8 C-3-8 -5-5 -5-2 C-5 2 0 8 0 8 C0 8 5 2 5-2 C5-5 3-8 0-8Z" fill="#10b981"/>
      <circle cy="-2" r="2.5" fill="white"/>
    </g>

    {/* Dotted route line Jodhpur→Jaipur */}
    <path d="M82,121 Q100,100 130,95" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="5 4" fill="none" opacity="0.8"/>

    {/* State name */}
    <text x="140" y="135" textAnchor="middle" fontSize="11" fill="#153a62" fontWeight="800" opacity="0.6">राजस्थान</text>
  </svg>
);

/* ─── Feature Pill ─── */
const FeaturePill = ({ icon, title, subtitle, color, delay }) => (
  <div className="splash-feature-pill" style={{ '--pill-color': color, animationDelay: delay }}>
    <div className="splash-feature-pill-icon" style={{ background: color }}>
      {icon}
    </div>
    <div>
      <div className="splash-feature-pill-title">{title}</div>
      <div className="splash-feature-pill-subtitle">{subtitle}</div>
    </div>
  </div>
);

/* ─── MAIN COMPONENT ─── */
export const SplashScreen = ({ onFinish }) => {
  const [fade, setFade] = useState(false);
  const [progress, setProgress] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Entry animation
    const entryTimer = setTimeout(() => setEntered(true), 50);

    // Progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 80);

    // Auto-dismiss after 5.5s
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 500);
    }, 5500);

    return () => { clearInterval(interval); clearTimeout(timer); clearTimeout(entryTimer); };
  }, [onFinish]);

  const handleSkip = useCallback(() => {
    setFade(true);
    setTimeout(onFinish, 300);
  }, [onFinish]);

  return (
    <>
      {/* SVG Saree Wave Filter */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="sareeWaveFilter" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" dur="3.5s" values="0.018 0.045;0.028 0.07;0.018 0.045" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      {/* Full-Screen Splash Wrapper */}
      <div className={`splash-new-root ${entered ? 'splash-new-entered' : ''} ${fade ? 'splash-new-fadeout' : ''}`}>

        {/* ── TOP HEADER BAR ── */}
        <header className="splash-header">
          {/* Left: Govt Logos */}
          <div className="splash-header-left">
            <EmblemIcon/>
            <div className="splash-header-govttext">
              <span className="splash-govt-name">राजस्थान सरकार</span>
              <span className="splash-govt-dept">महिला एवं बाल विकास विभाग</span>
              <span className="splash-govt-sub">सत्यमेव जयते</span>
            </div>
          </div>

          {/* Right: Anganwadi Logo + Skip */}
          <div className="splash-header-right">
            <div className="splash-header-anganwadi">
              <AnganwadiIcon/>
              <div className="splash-anganwadi-text">
                <span>सशक्त आंगनवाड़ी</span>
                <span>सशक्त राजस्थान</span>
              </div>
            </div>
            <button className="splash-new-skip" onClick={handleSkip}>
              Skip Intro <ArrowRight size={14}/>
            </button>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="splash-main">

          {/* LEFT: ASHA Worker portrait with saree wave */}
          <div className="splash-asha-worker-col">
            <div className="splash-asha-img-wrapper">
              <img src="/splash-poster.jpg" alt="ASHA Worker" className="splash-asha-portrait"/>
              {/* Animated Saree Wave Overlay */}
              <div className="splash-saree-wave-layer">
                <img src="/splash-poster.jpg" alt="" className="splash-saree-wave-img" aria-hidden="true"/>
                <div className="splash-saree-shimmer"/>
              </div>
            </div>
          </div>

          {/* CENTER: Brand + Features */}
          <div className="splash-center-col">
            {/* EK ASHA Logo Block */}
            <div className="splash-brand-block">
              {/* Rajasthan Map icon with ASHA figure */}
              <div className="splash-logo-emblem">
                <svg viewBox="0 0 110 100" width="110" height="100">
                  <defs>
                    <linearGradient id="logoMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#b8d4ef"/>
                      <stop offset="100%" stopColor="#87beea"/>
                    </linearGradient>
                  </defs>
                  {/* Map shape */}
                  <path d="M20 15 L45 8 L70 12 L90 5 L102 22 L105 50 L98 72 L80 88 L60 95 L40 92 L22 80 L10 60 L8 38 Z"
                    fill="url(#logoMapGrad)" stroke="#0284c7" strokeWidth="1.5" opacity="0.85"/>
                  {/* ASHA figure (seated, reading) */}
                  <circle cx="62" cy="38" r="7" fill="#153a62"/>
                  <path d="M62 45 L58 65 L66 65 Z" fill="#153a62"/>
                  <path d="M55 50 L68 50" stroke="#0284c7" strokeWidth="2"/>
                  {/* Dupatta / scarf */}
                  <path d="M55 42 Q50 50 48 60" stroke="#e11d48" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  {/* Bag */}
                  <rect x="52" y="58" width="8" height="7" rx="1" fill="#153a62"/>
                  <text x="56" y="63.5" textAnchor="middle" fontSize="4" fill="white">+</text>
                  {/* Medical cross badge */}
                  <circle cx="77" cy="32" r="6" fill="#0284c7"/>
                  <text x="77" y="35.5" textAnchor="middle" fontSize="7" fill="white">+</text>
                  {/* Sun */}
                  <circle cx="88" cy="18" r="8" fill="#fbbf24" opacity="0.9"/>
                  {[0,45,90,135,180,225,270,315].map(a => (
                    <line key={a}
                      x1={88+10*Math.cos(a*Math.PI/180)}
                      y1={18+10*Math.sin(a*Math.PI/180)}
                      x2={88+13*Math.cos(a*Math.PI/180)}
                      y2={18+13*Math.sin(a*Math.PI/180)}
                      stroke="#fbbf24" strokeWidth="1.5"/>
                  ))}
                </svg>
              </div>

              <div className="splash-brand-wordmark">
                <span className="splash-brand-ek">EK</span>
                <span className="splash-brand-asha"> ASHA</span>
              </div>

              <div className="splash-brand-hindi">
                बेहतर योजना &nbsp;|&nbsp; स्वस्थ समाज
              </div>

              <div className="splash-brand-tagline">
                <span>Connecting People</span>
                <span className="splash-dot">•</span>
                <span>Optimising Visits</span>
                <span className="splash-dot">•</span>
                <span>Prioritising Health</span>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="splash-features-row">
              <FeaturePill
                delay="0.1s"
                color="#0284c7"
                title="सही व्यक्ति"
                subtitle="(समुदाय से जुड़ाव)"
                icon={
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="17" cy="8" r="3"/><circle cx="9" cy="10" r="4"/>
                    <path d="M1 20c0-4 3.6-7 8-7 1 0 2 .2 3 .5M15 21c0-3 1.8-5 5-5"/>
                  </svg>
                }
              />
              <FeaturePill
                delay="0.2s"
                color="#10b981"
                title="बेहतर योजना"
                subtitle="(रूट ऑप्टिमाइज़ेशन)"
                icon={
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    <path d="M8 14h2l2 3 2-6 2 3h2"/>
                  </svg>
                }
              />
              <FeaturePill
                delay="0.3s"
                color="#f59e0b"
                title="उच्च प्राथमिकता"
                subtitle="(जोखिम के आधार पर)"
                icon={
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                }
              />
            </div>

            {/* Loading row */}
            <div className="splash-loading-section">
              <div className="splash-loading-text-row">
                <Loader2 className="splash-spinner" size={20}/>
                <span className="splash-loading-hindi">हम एक बेहतर कल के लिए जुड़ रहे हैं...</span>
              </div>
              <div className="splash-progress-track">
                <div className="splash-progress-fill" style={{ width: `${progress}%` }}/>
              </div>
            </div>
          </div>

          {/* RIGHT: Rajasthan Map */}
          <div className="splash-map-col">
            <div className="splash-map-wrapper">
              <RajasthanMapSVG animated={true}/>
              {/* Health Center Illustration */}
              <div className="splash-health-center">
                <div className="splash-hc-building">
                  <div className="splash-hc-sign">
                    <span className="splash-hc-plus">+</span>
                  </div>
                  <div className="splash-hc-label">उप स्वास्थ्य केन्द्र</div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};
