import React from 'react';
import { FacilityMap } from '../components/FacilityMap';
import { MapPin, ShieldCheck, Info } from 'lucide-react';

export const HealthcareMapPage = () => {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 48px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--blue-accent)', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <MapPin size={16} /> Sitapura & Sanganer Healthcare Map · Jaipur
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--navy-deep)', lineHeight: 1.2 }}>
            Nearby Healthcare Facilities
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: 6, maxWidth: 600 }}>
            Verified public healthcare centers, PHCs, CHCs, and tertiary hospitals. Click any marker to see details, book OPD, or call directly.
          </p>
        </div>
      </div>

      {/* Full-height Map */}
      <FacilityMap height="560px" showSearch={true} />

      {/* Legend */}
      <div style={{
        background: '#f8fafc', padding: '14px 20px', borderRadius: 12,
        border: '1px solid #e2e8f0', display: 'flex',
        alignItems: 'center', gap: 24, flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
          <Info size={14} color="#64748b" /> Map Legend:
        </div>
        {[
          { emoji: '🏥', label: 'Hospital / Tertiary', color: '#0284c7' },
          { emoji: '🟢', label: 'PHC / CHC',           color: '#16a34a' },
          { emoji: '💊', label: 'Pharmacy',             color: '#d97706' },
          { emoji: '📍', label: 'Your Location',        color: '#16a34a' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#475569' }}>
            <span>{item.emoji}</span>
            <span style={{ fontWeight: 600, color: item.color }}>{item.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#64748b' }}>
          <ShieldCheck size={14} color="#16a34a" />
          All locations verified — Sitapura, Pratap Nagar, Sanganer, Beelwa · Jaipur
        </div>
      </div>
    </div>
  );
};
