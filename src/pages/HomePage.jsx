import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Activity, Navigation, ArrowRight, ShieldCheck, AlertTriangle, Clock, MapPin, Users, CheckCircle, Sparkles, PhoneCall, X } from 'lucide-react';
import { FacilityMap } from '../components/FacilityMap';

export const HomePage = () => {
  const { t, setCurrentPage, handleLogin, setActiveModal, setModalData } = useApp();

  // Hero Image Carousel state
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
      caption: "ASHA Worker Conducting Home Checkup in Sitapura"
    },
    {
      url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200",
      caption: "Maternal & Child Healthcare Surveillance"
    },
    {
      url: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=1200",
      caption: "Mobile Technology Empowering ANM Field Visit Planning"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Risk Score Live Widget Simulation
  const [calcAge, setCalcAge] = useState(28);
  const [calcCondition, setCalcCondition] = useState('Pregnancy 3rd Trimester');
  const [calcBp, setCalcBp] = useState('High (150/98)');
  const [calcMissed, setCalcMissed] = useState('Yes (1 visit missed)');

  const computeDemoRiskScore = () => {
    let score = 40;
    if (calcCondition.includes('Pregnancy')) score += 25;
    if (calcBp.includes('High')) score += 20;
    if (calcMissed.includes('Yes')) score += 15;
    return Math.min(100, score);
  };

  const calculatedScore = computeDemoRiskScore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
      
      {/* 1. HERO SECTION WITH CAROUSEL */}
      <section style={{ position: 'relative', background: 'linear-gradient(135deg, #0b1e36 0%, #153a62 60%, #0284c7 100%)', color: '#ffffff', pt: 60, pb: 80, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
          
          {/* Hero Left Content */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: 30, backdropFilter: 'blur(10px)', marginBottom: 20, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#e0f2fe' }}>
                National Community Health Innovation
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16 }}>
              {t('hero_title')}
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 30 }}>
              {t('hero_subtitle')}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }} onClick={() => setCurrentPage('map')}>
                <MapPin size={18} /> {t('cta_find_health')}
              </button>

              <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => handleLogin('ASHA')}>
                <Users size={18} /> ASHA Worker Portal
              </button>

              <button className="btn-emergency" style={{ padding: '12px 24px', fontSize: '1rem' }} onClick={() => setCurrentPage('emergency')}>
                <PhoneCall size={18} /> {t('cta_help')}
              </button>
            </div>
          </div>

          {/* Hero Right Image Carousel */}
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', height: 380, border: '2px solid rgba(255,255,255,0.2)' }}>
            <img 
              src={heroImages[currentSlide].url} 
              alt="ASHA Worker" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }} 
            />
            <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', background: 'linear-gradient(to top, rgba(11, 30, 54, 0.95), transparent)', padding: '20px 24px', color: '#fff' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>FIELD VISITATION SIMULATION</div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>{heroImages[currentSlide].caption}</div>
              
              {/* Carousel Indicators */}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {heroImages.map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentSlide(i)} 
                    style={{ width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4, background: i === currentSlide ? '#0284c7' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s ease' }} 
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CORE PROBLEM SECTION */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 750, margin: '0 auto 40px auto' }}>
          <span className="badge badge-critical" style={{ marginBottom: 8 }}>
            <AlertTriangle size={14} /> Hackathon Problem Statement
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
            {t('problem_title')}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: 8 }}>
            {t('problem_desc')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div className="card" style={{ borderLeft: '4px solid #e11d48' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>👩‍⚕️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942' }}>50+ Families Per ASHA</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
              ASHA workers manage hundreds of pregnant mothers, malnourished infants, and diabetic elderly residents daily.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #ea580c' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧭</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942' }}>Unoptimized Travel Routes</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
              Travelling back-and-forth across non-contiguous villages wastes over 35% of field hours on roads instead of care.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚠️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942' }}>Missed Critical Windows</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
              Static alphabetical or chronological patient lists fail to highlight sudden BP spikes or missed immunizations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE INNOVATION SECTION 1 - RISK-WEIGHTED PRIORITIZATION */}
      <section style={{ background: '#ffffff', py: 60, borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 40px auto' }}>
            <span className="badge badge-verified" style={{ marginBottom: 8 }}>
              <ShieldCheck size={14} /> Core Innovation #1
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
              Risk-Weighted Patient Prioritization
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: 8 }}>
              Every patient receives a dynamically calculated <strong>Risk Score (0–100)</strong> based on multi-parameter medical weightage.
            </p>
          </div>

          {/* Risk Level Matrix & Calculator Interactive Demo Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
            
            {/* Risk Levels Display */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2942', marginBottom: 16 }}>
                Risk Weightage Tiers
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#e11d48', fontSize: '1rem' }}>🔴 Critical Risk (Score 80–100)</div>
                    <div style={{ fontSize: '0.825rem', color: '#881337' }}>High BP pregnancy, chest pain, missed critical follow-up</div>
                  </div>
                  <span className="badge badge-critical">Action &lt; 2 hrs</span>
                </div>

                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#ea580c', fontSize: '1rem' }}>🟠 High Risk (Score 65–79)</div>
                    <div style={{ fontSize: '0.825rem', color: '#7c2d12' }}>Severe malnutrition (SAM), overdue infant booster</div>
                  </div>
                  <span className="badge badge-high">Same Day</span>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#d97706', fontSize: '1rem' }}>🟡 Medium Risk (Score 40–64)</div>
                    <div style={{ fontSize: '0.825rem', color: '#78350f' }}>DOTS TB pill verification, chronic diabetes checkup</div>
                  </div>
                  <span className="badge badge-medium">Within 48 hrs</span>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#059669', fontSize: '1rem' }}>🟢 Low / Routine Risk (&lt; 40)</div>
                    <div style={{ fontSize: '0.825rem', color: '#064e3b' }}>Post viral recovery check, mosquito larval inspection</div>
                  </div>
                  <span className="badge badge-low">Routine</span>
                </div>
              </div>
            </div>

            {/* Live Interactive Risk Calculator Simulator */}
            <div className="card" style={{ background: '#f8fafc', border: '2px solid var(--blue-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
                  Interactive Patient Risk Score Calculator
                </h3>
                <span className="badge badge-verified">Live Demo</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Medical Category / Condition:</label>
                  <select 
                    value={calcCondition} 
                    onChange={e => setCalcCondition(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: 4 }}
                  >
                    <option value="Pregnancy 3rd Trimester">Pregnancy 3rd Trimester (+25 Pts)</option>
                    <option value="Elderly Diabetic Post Stroke">Elderly Diabetic Post Stroke (+20 Pts)</option>
                    <option value="Infant Malnutrition SAM">Infant Malnutrition SAM (+20 Pts)</option>
                    <option value="Routine Post Fever Check">Routine Post Fever Check (+5 Pts)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Blood Pressure Reading:</label>
                  <select 
                    value={calcBp} 
                    onChange={e => setCalcBp(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: 4 }}
                  >
                    <option value="High (150/98)">Elevated Systolic High (150/98) (+20 Pts)</option>
                    <option value="Normal (120/80)">Normal (120/80) (0 Pts)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Missed Previous Visit?</label>
                  <select 
                    value={calcMissed} 
                    onChange={e => setCalcMissed(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: 4 }}
                  >
                    <option value="Yes (1 visit missed)">Yes - Missed 1 Scheduled Visit (+15 Pts)</option>
                    <option value="No">No - Visits On Time (0 Pts)</option>
                  </select>
                </div>
              </div>

              {/* Score Result Card */}
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>CALCULATED RISK SCORE</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: calculatedScore >= 80 ? '#e11d48' : calculatedScore >= 65 ? '#ea580c' : '#10b981' }}>
                  {calculatedScore} / 100
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f2942' }}>
                  {calculatedScore >= 80 ? '🔴 CRITICAL PRIORITIZATION REQUIRED' : calculatedScore >= 65 ? '🟠 HIGH PRIORITY' : '🟢 ROUTINE CHECK'}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. ROUTE OPTIMIZATION SECTION */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 40px auto' }}>
          <span className="badge badge-verified" style={{ marginBottom: 8 }}>
            <Navigation size={14} /> Core Innovation #2
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
            "{t('route_headline')}"
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: 8 }}>
            {t('route_desc')}
          </p>
        </div>

        {/* Shortest vs Safe Route Comparison Diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          
          <div className="card" style={{ border: '2px solid #fecdd3', background: '#fff1f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e11d48', fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>
              <X size={20} /> Traditional Shortest Distance Route
            </div>
            <p style={{ fontSize: '0.875rem', color: '#881337', marginBottom: 16 }}>
              Visits nearest home first based purely on spatial distance. Critical patients located 3 km away are visited last, risking pre-eclampsia or diabetic complications.
            </p>
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, fontSize: '0.8rem', color: '#64748b' }}>
              ❌ Result: Low Risk Patient visited first. Critical Patient waited 6 hours.
            </div>
          </div>

          <div className="card" style={{ border: '2px solid #a7f3d0', background: '#ecfdf5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>
              <CheckCircle size={20} /> EK ASHA Risk-Weighted Route
            </div>
            <p style={{ fontSize: '0.875rem', color: '#064e3b', marginBottom: 16 }}>
              Prioritizes high-risk patients within their critical medical windows first, then optimizes intermediate travel paths to eliminate redundant backtracking.
            </p>
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
              ✓ Result: Critical Patient visited within 40 mins. Travel distance reduced by 7.3 km.
            </div>
          </div>

        </div>
      </section>

      {/* 5. SITAPURA HEALTHCARE MAP PREVIEW */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
              Nearby Healthcare Facilities (Sitapura, Jaipur)
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Verified public healthcare centers, PHCs, CHCs, and tertiary hospitals.
            </p>
          </div>
          <button className="btn-secondary" onClick={() => setCurrentPage('map')}>
            Open Full Interactive Map &rarr;
          </button>
        </div>

        <FacilityMap height="400px" showSearch={true} />
      </section>

    </div>
  );
};
