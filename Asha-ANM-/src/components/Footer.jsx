import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, PhoneCall, ShieldCheck, MapPin, Mail, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const { t, setCurrentPage } = useApp();

  return (
    <footer style={{ background: 'var(--navy-deep)', color: '#ffffff', pt: 48, pb: 24, marginTop: 60, borderTop: '4px solid var(--blue-accent)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 36, pb: 36, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ background: 'var(--blue-accent)', padding: 8, borderRadius: 8, color: '#fff' }}>
                <Heart size={22} fill="#fff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{t('brand_name')}</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 16 }}>
              {t('tagline')}
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.825rem', lineHeight: 1.5 }}>
              A national community healthcare innovation empowering ASHA & ANM workers through risk-weighted patient visit scheduling and travel route optimization.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#38bdf8', marginBottom: 16, fontWeight: 700 }}>{t('nav_services')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li><button onClick={() => setCurrentPage('home')} style={{ color: '#cbd5e1' }}>Home</button></li>
              <li><button onClick={() => setCurrentPage('about')} style={{ color: '#cbd5e1' }}>About EK ASHA</button></li>
              <li><button onClick={() => setCurrentPage('map')} style={{ color: '#cbd5e1' }}>Sitapura Healthcare Map</button></li>
              <li><button onClick={() => setCurrentPage('grievances')} style={{ color: '#cbd5e1' }}>Grievance Redressal Portal</button></li>
              <li><button onClick={() => setCurrentPage('emergency')} style={{ color: '#f43f5e', fontWeight: 700 }}>🚨 Emergency Assistance</button></li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#38bdf8', marginBottom: 16, fontWeight: 700 }}>National Health Helplines</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PhoneCall size={18} color="#f43f5e" />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>108 - Medical Emergency / Ambulance</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>24x7 National Emergency Dispatch</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PhoneCall size={18} color="#0284c7" />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>104 - National Health Helpline</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Medical Advice & ASHA Consultation</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={18} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>Sitapura / Beelwa Sector Hub</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PHC Beelwa & MGMC Hospital, Jaipur</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hackathon Disclaimer & Technology */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#38bdf8', marginBottom: 16, fontWeight: 700 }}>Hackathon Prototype Notice</h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: 14, borderRadius: 10, fontSize: '0.825rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: 700, marginBottom: 6 }}>
                <ShieldCheck size={16} />
                <span>Verified Public Data + Simulated Ops</span>
              </div>
              Facility names & coordinates are derived from verified Sitapura, Jaipur public healthcare records. Operational patient risk metrics are simulated for demonstration.
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div style={{ pt: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', gap: 12 }}>
          <div>© 2026 EK ASHA Platform — National Health Innovation Project. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Privacy Policy</span>
            <span>Government Portal Terms</span>
            <span>ASHA/ANM Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
