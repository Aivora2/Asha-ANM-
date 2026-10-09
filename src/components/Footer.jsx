import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Info, PlusSquare, MapPin, MessageSquare, Phone, Ambulance, ShieldCheck, FileText, Building2, Accessibility, ShieldAlert, ArrowRight } from 'lucide-react';

export const Footer = () => {
  const { setCurrentPage } = useApp();

  // Theme dark blue color matching the screenshot
  const footerBg = '#00376d'; 
  const bottomBarBg = '#002d59';
  const lightBlue = '#38bdf8';
  const textGray = '#cbd5e1';

  return (
    <footer style={{ background: footerBg, color: '#ffffff', borderTop: '4px solid var(--blue-accent)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
          
          {/* Column 1: Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/ek-asha-logo-transparent.png" alt="Ek Asha Logo" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>EK ASHA</div>
                <div style={{ fontSize: '0.9rem', color: textGray }}>Healthcare Platform</div>
              </div>
            </div>
            <h4 style={{ color: lightBlue, fontSize: '1rem', fontWeight: 700, marginTop: 4 }}>
              Right Patient. Right Priority. Right Route.
            </h4>
            <p style={{ color: textGray, fontSize: '0.85rem', lineHeight: 1.6 }}>
              A national community healthcare innovation empowering ASHA & ANM workers through risk-weighted patient prioritization and smarter travel route optimization.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: lightBlue, marginBottom: 20, fontWeight: 700, letterSpacing: '0.5px' }}>PLATFORM LINKS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: Home, label: 'Home', page: 'home' },
                { icon: Info, label: 'About EK ASHA', page: 'about' },
                { icon: PlusSquare, label: 'Healthcare Services', page: 'services' },
                { icon: MapPin, label: 'Sitapura Healthcare Map', page: 'map' },
                { icon: MessageSquare, label: 'Grievance Redressal', page: 'grievances' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button onClick={() => setCurrentPage(link.page)} style={{ 
                    color: '#ffffff', background: 'none', border: 'none', cursor: 'pointer', 
                    fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 10, padding: 0, textAlign: 'left' 
                  }}>
                    <link.icon size={18} color={lightBlue} style={{ flexShrink: 0 }} />
                    <span style={{ transition: 'opacity 0.2s' }}>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Emergency & Support */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: lightBlue, marginBottom: 20, fontWeight: 700, letterSpacing: '0.5px' }}>EMERGENCY & SUPPORT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Ambulance size={28} color="#f87171" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>108</div>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>Medical Emergency / Ambulance</div>
                  <div style={{ fontSize: '0.75rem', color: textGray, marginTop: 2 }}>24x7 National Emergency Dispatch</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Phone size={24} color="#34d399" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>104</div>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>National Health Helpline</div>
                  <div style={{ fontSize: '0.75rem', color: textGray, marginTop: 2 }}>Medical Advice & ASHA Consultation</div>
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

              <button 
                onClick={() => setCurrentPage('emergency')} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', 
                  background: 'none', border: 'none', cursor: 'pointer', 
                  fontSize: '0.9rem', fontWeight: 700, padding: 0,
                  transition: 'transform 0.2s'
                }}
              >
                <ShieldAlert size={18} /> Emergency Assistance <ArrowRight size={16} />
              </button>

            </div>
          </div>

          {/* Column 4: Resources & Transparency */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: lightBlue, marginBottom: 20, fontWeight: 700, letterSpacing: '0.5px' }}>RESOURCES & TRANSPARENCY</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[
                { icon: FileText, label: 'ASHA/ANM Guidelines' },
                { icon: ShieldCheck, label: 'Privacy Policy' },
                { icon: Building2, label: 'Government Portal Terms' },
                { icon: Accessibility, label: 'Accessibility' }
              ].map((link, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ffffff', fontSize: '0.9rem' }}>
                  <link.icon size={18} color={lightBlue} style={{ flexShrink: 0 }} />
                  {link.label}
                </li>
              ))}
            </ul>

            <div style={{ 
              background: 'rgba(56, 189, 248, 0.1)', 
              border: '1px solid rgba(56, 189, 248, 0.2)', 
              borderRadius: 8, padding: '12px 14px', 
              display: 'flex', alignItems: 'flex-start', gap: 10 
            }}>
              <ShieldCheck size={24} color="#34d399" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: 4 }}>Prototype Notice</div>
                <div style={{ fontSize: '0.75rem', color: textGray, lineHeight: 1.4 }}>
                  Public facility data is verified from trusted sources. Operational patient-risk metrics are simulated for demonstration.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div style={{ background: bottomBarBg, padding: '20px 40px' }}>
        <div style={{ 
          maxWidth: 1400, margin: '0 auto', 
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', 
          fontSize: '0.8rem', color: textGray, gap: 16 
        }}>
          <div>© 2026 EK ASHA Platform — National Health Innovation Project</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ cursor: 'pointer' }}>Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
