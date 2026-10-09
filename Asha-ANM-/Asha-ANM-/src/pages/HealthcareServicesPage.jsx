import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hospital, Phone, ShieldCheck, Clock, MapPin, Calendar, Search } from 'lucide-react';

export const HealthcareServicesPage = () => {
  const { healthcareFacilities, setActiveModal, setModalData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');

  const filtered = healthcareFacilities.filter(f => {
    const matchCat = category === 'ALL' || 
      (category === 'HOSPITAL' && f.type.toLowerCase().includes('hospital')) ||
      (category === 'PHC' && (f.type.toLowerCase().includes('phc') || f.type.toLowerCase().includes('chc'))) ||
      (category === 'PHARMACY' && f.type.toLowerCase().includes('pharmacy'));

    const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchCat && matchSearch;
  });

  const handleBookOpd = (fac, doc) => {
    setModalData({ facility: fac, doctor: doc });
    setActiveModal('appointment');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
          Public Healthcare Services Directory
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Verified public hospitals, Primary Health Centres (PHC), Community Health Centres (CHC), and Generic Pharmacies in Sitapura, Jaipur.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={20} style={{ position: 'absolute', left: 14, top: 12, color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search hospitals, doctors, specialty or address..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'HOSPITAL', 'PHC', 'PHARMACY'].map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: '0.85rem',
                fontWeight: 700,
                background: category === c ? 'var(--navy-primary)' : '#f1f5f9',
                color: category === c ? '#fff' : '#64748b'
              }}
            >
              {c === 'ALL' ? 'All Services' : c === 'HOSPITAL' ? '🏥 Hospitals' : c === 'PHC' ? '🟢 PHC / CHC' : '💊 Pharmacy'}
            </button>
          ))}
        </div>
      </div>

      {/* Services List Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {filtered.map(fac => (
          <div key={fac.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>{fac.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>{fac.type}</div>
                </div>
                {fac.verified && (
                  <span className="badge badge-verified"><ShieldCheck size={14} /> Verified</span>
                )}
              </div>

              <p style={{ color: '#64748b', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                <MapPin size={16} color="#e11d48" /> {fac.address}
              </p>

              {fac.emergency24x7 && (
                <div style={{ background: '#ffe4e6', color: '#e11d48', padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, marginBottom: 12 }}>
                  🚨 24x7 Emergency Services & ICU ({fac.icuBedsAvailable} Beds Available)
                </div>
              )}

              {/* Services List */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#153a62', marginBottom: 4 }}>Key Clinical Services:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {fac.services.map((s, idx) => (
                    <span key={idx} style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Doctors */}
              {fac.doctors && fac.doctors.length > 0 && (
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f2942', marginBottom: 6 }}>OPD Doctors:</div>
                  {fac.doctors.map((doc, dIdx) => (
                    <div key={dIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', pt: 4 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.specialty}</div>
                      </div>
                      <button 
                        onClick={() => handleBookOpd(fac, doc)}
                        style={{ background: 'var(--teal-brand)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        Book OPD
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 10, pt: 12, borderTop: '1px solid #e2e8f0' }}>
              <a href={`tel:${fac.phone}`} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                <Phone size={16} /> Call Desk
              </a>
              <a href={`https://maps.google.com/?q=${fac.lat},${fac.lng}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                GPS Map
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
