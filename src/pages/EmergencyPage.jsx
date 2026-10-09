import React from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, ShieldAlert, MapPin, Hospital, Users, Navigation, AlertTriangle } from 'lucide-react';

export const EmergencyPage = () => {
  const { setActiveModal, showToast, user } = useApp();

  const handleAmbulanceDispatch = () => {
    showToast('🚨 DEMO REQUEST: 108 Emergency Ambulance Dispatched to your location!');
  };

  const handleShareGps = () => {
    showToast('📍 GPS Location (26.7850 N, 75.8300 E Sitapura) copied & dispatched.');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Emergency Header */}
      <div style={{ background: '#ffe4e6', border: '2px solid #fecdd3', borderRadius: 20, padding: 30, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: '#e11d48', color: '#fff', borderRadius: '50%', marginBottom: 16 }}>
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#9f1239' }}>
          🚨 EMERGENCY ASSISTANCE
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#881337', fontWeight: 600, maxWidth: 700, margin: '8px auto 0 auto' }}>
          Immediate emergency support for maternal complications, severe injuries, and sudden health crises in Sitapura sector.
        </p>
      </div>

      {/* Main Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        
        {/* 1. Ambulance Dispatch */}
        <div className="card" style={{ borderLeft: '6px solid #e11d48', background: '#fff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🚑</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2942' }}>Call 108 Ambulance</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 16 }}>
            Direct emergency medical transport dispatch with basic life support (BLS).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="tel:108" className="btn-emergency" style={{ justifyContent: 'center' }}>
              <PhoneCall size={18} /> Dial 108 Helpline
            </a>
            <button className="btn-secondary" onClick={handleAmbulanceDispatch} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
              Dispatch Demo Ambulance
            </button>
          </div>
        </div>

        {/* 2. Contact Assigned ASHA / ANM */}
        <div className="card" style={{ borderLeft: '6px solid #0284c7', background: '#fff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>👩‍⚕️</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2942' }}>Contact Assigned ASHA</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 16 }}>
            Sunita Devi (ASHA Worker - Beat 4, Sitapura). Phone: +91 98290 12345
          </p>
          <button className="btn-primary" onClick={() => {
            if (!user) {
              alert('login to connect to asha worker');
            } else {
              setActiveModal('emergency-sos');
            }
          }} style={{ justifyContent: 'center', width: '100%' }}>
            <Users size={18} /> Alert My ASHA Immediately
          </button>
        </div>

        {/* 3. Emergency Hospital Locator */}
        <div className="card" style={{ borderLeft: '6px solid #10b981', background: '#fff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏥</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2942' }}>Mahatma Gandhi Hospital</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 16 }}>
            24x7 Emergency Trauma & NICU Ward (1.2 km from Sitapura). Phone: 0141-2771777
          </p>
          <a href="https://maps.google.com/?q=26.7758,75.8342" target="_blank" rel="noreferrer" className="btn-secondary" style={{ justifyContent: 'center', display: 'flex' }}>
            <Navigation size={18} /> GPS Route to MGMC Hospital
          </a>
        </div>

      </div>

      {/* Share Location Row */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MapPin size={28} color="#e11d48" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f2942' }}>Share GPS Coordinates</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Sitapura Institutional Area, Jaipur (Lat 26.7850, Lng 75.8300)</div>
          </div>
        </div>
        <button className="btn-secondary" onClick={handleShareGps}>
          Copy & Dispatch GPS Location
        </button>
      </div>

    </div>
  );
};
