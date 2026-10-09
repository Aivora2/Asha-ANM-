import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital, Phone, ShieldCheck, Navigation, Clock, User, Filter, Search } from 'lucide-react';

// Fix standard marker icons in Leaflet React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Healthcare Pin Icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">🏥</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const hospitalIcon = createCustomIcon('#0284c7');
const phcIcon = createCustomIcon('#10b981');
const pharmacyIcon = createCustomIcon('#f59e0b');

export const FacilityMap = ({ height = '450px', showSearch = true }) => {
  const { healthcareFacilities, setActiveModal, setModalData } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Default Sitapura, Jaipur Center Coordinates
  const centerLat = 26.7850;
  const centerLng = 75.8300;

  const filteredFacilities = healthcareFacilities.filter(f => {
    const matchesFilter = filterType === 'ALL' || 
      (filterType === 'HOSPITAL' && f.type.toLowerCase().includes('hospital')) ||
      (filterType === 'PHC' && (f.type.toLowerCase().includes('phc') || f.type.toLowerCase().includes('chc'))) ||
      (filterType === 'PHARMACY' && f.type.toLowerCase().includes('pharmacy'));
    
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const getIconForFacility = (type) => {
    if (type.toLowerCase().includes('phc') || type.toLowerCase().includes('chc')) return phcIcon;
    if (type.toLowerCase().includes('pharmacy')) return pharmacyIcon;
    return hospitalIcon;
  };

  const handleBookAppointment = (facility, doc) => {
    setModalData({ facility, doctor: doc });
    setActiveModal('appointment');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Search & Filter Header */}
      {showSearch && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search Sitapura hospitals, PHC, doctors or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Filter:</span>
            {['ALL', 'HOSPITAL', 'PHC', 'PHARMACY'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: filterType === t ? 'var(--navy-primary)' : '#f1f5f9',
                  color: filterType === t ? '#fff' : '#64748b'
                }}
              >
                {t === 'ALL' ? 'All Facilities' : t === 'HOSPITAL' ? '🏥 Hospitals' : t === 'PHC' ? '🟢 PHC / CHC' : '💊 Pharmacy'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Element */}
      <div style={{ height, borderRadius: 16, overflow: 'hidden', border: '1px solid #cbd5e1', position: 'relative' }}>
        <MapContainer center={[centerLat, centerLng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredFacilities.map(f => (
            <Marker 
              key={f.id} 
              position={[f.lat, f.lng]} 
              icon={getIconForFacility(f.type)}
              eventHandlers={{
                click: () => setSelectedFacility(f)
              }}
            >
              <Popup>
                <div style={{ padding: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f2942' }}>{f.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginBottom: 4 }}>{f.type}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{f.address}</div>
                  {f.emergency24x7 && (
                    <div style={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 700, marginTop: 4 }}>
                      🚨 24x7 Emergency Available
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedFacility(f)} 
                    style={{ marginTop: 8, padding: '4px 10px', background: '#153a62', color: '#fff', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected Facility Detail Drawer / Card */}
      {selectedFacility && (
        <div className="card" style={{ borderLeft: '4px solid var(--blue-accent)', animation: 'modalSlideIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-deep)', fontWeight: 800 }}>{selectedFacility.name}</h3>
                {selectedFacility.verified && (
                  <span className="badge badge-verified" title="Verified Public Facility">
                    <ShieldCheck size={14} /> Verified Facility
                  </span>
                )}
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{selectedFacility.address}</p>
            </div>

            <button 
              onClick={() => setSelectedFacility(null)} 
              style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, background: '#f1f5f9', padding: '4px 10px', borderRadius: 6 }}
            >
              Close Details
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16, background: '#f8fafc', padding: 14, borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>DISTANCE FROM SITAPURA</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{selectedFacility.distance}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>EMERGENCY / ICU BEDS</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: selectedFacility.emergency24x7 ? '#e11d48' : '#64748b' }}>
                {selectedFacility.emergency24x7 ? `🚨 24x7 Emergency (${selectedFacility.icuBedsAvailable} ICU Beds)` : 'OPD Only'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>CONTACT HELPLINE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone size={14} /> {selectedFacility.phone}
              </div>
            </div>
          </div>

          {/* Key Services Offered */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f2942', marginBottom: 6 }}>Available Services & Facilities:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedFacility.services.map((s, i) => (
                <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: 20, fontSize: '0.775rem', fontWeight: 600 }}>
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Doctors Available */}
          {selectedFacility.doctors && selectedFacility.doctors.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f2942', marginBottom: 8 }}>Available Doctors & Duty Timings:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                {selectedFacility.doctors.map((doc, idx) => (
                  <div key={idx} style={{ border: '1px solid #e2e8f0', padding: 10, borderRadius: 8, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.775rem', color: '#0284c7' }}>{doc.specialty}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={12} /> {doc.available}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBookAppointment(selectedFacility, doc)}
                      style={{ padding: '6px 10px', background: 'var(--teal-brand)', color: '#fff', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      Book OPD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16, pt: 12, borderTop: '1px solid #e2e8f0' }}>
            <a 
              href={`https://maps.google.com/?q=${selectedFacility.lat},${selectedFacility.lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              <Navigation size={16} /> Get GPS Directions
            </a>
            <a 
              href={`tel:${selectedFacility.phone}`}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              <Phone size={16} /> Call Hospital Desk
            </a>
          </div>

        </div>
      )}
    </div>
  );
};
