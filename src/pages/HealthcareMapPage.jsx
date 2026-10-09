import React from 'react';
import { FacilityMap } from '../components/FacilityMap';
import { MapPin, ShieldCheck } from 'lucide-react';

export const HealthcareMapPage = () => {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
          <MapPin size={18} /> SITAPURA & SAN GANER HEALTHCARE MAP
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
          Interactive Healthcare Facilities Map
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Explore verified government hospitals, primary health centers (PHC), Community Health Centers (CHC), dispensaries, and Jan Aushadhi generic pharmacies in Sitapura, Jaipur.
        </p>
      </div>

      <FacilityMap height="600px" showSearch={true} />

      <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <ShieldCheck size={24} color="#10b981" />
        <div style={{ fontSize: '0.875rem', color: '#334155' }}>
          <strong>Verified Location Data:</strong> All facility markers correspond to real public healthcare locations in Sitapura, Pratap Nagar, Sanganer, and Beelwa, Jaipur.
        </div>
      </div>
    </div>
  );
};
