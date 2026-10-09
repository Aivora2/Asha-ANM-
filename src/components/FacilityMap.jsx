import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Phone, ShieldCheck, Navigation, Clock, User,
  Filter, Search, MapPin, X, Activity, Building2,
  Locate, Calendar
} from 'lucide-react';

/* ─── Fix broken leaflet default icons ─── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── Helper: create a coloured emoji circle icon ─── */
const mkIcon = (emoji, bg, sz = 34) =>
  L.divIcon({
    className: '',
    html: `<div style="
      background:${bg};width:${sz}px;height:${sz}px;border-radius:50%;
      border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.28);
      display:flex;align-items:center;justify-content:center;font-size:${sz * 0.44}px;
      line-height:1;
    ">${emoji}</div>`,
    iconSize:    [sz, sz],
    iconAnchor:  [sz / 2, sz / 2],
    popupAnchor: [0, -(sz / 2 + 4)],
  });

const ICONS = {
  hospital: mkIcon('🏥', '#1d6db5'),
  phc:      mkIcon('🟢', '#16a34a'),
  chc:      mkIcon('🏛️', '#0d7b55'),
  pharmacy: mkIcon('💊', '#b45309'),
  maternity:mkIcon('🤱', '#9333ea'),
  dispensary: mkIcon('🏨', '#6b7280'),
  user:     mkIcon('📍', '#16a34a', 42),
};

const resolveIcon = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('pharmacy'))   return ICONS.pharmacy;
  if (t.includes('maternity'))  return ICONS.maternity;
  if (t.includes('dispensary')) return ICONS.dispensary;
  if (t.includes('chc'))        return ICONS.chc;
  if (t.includes('phc'))        return ICONS.phc;
  return ICONS.hospital;
};

/* ─── Inner: smoothly flies map when target changes ─── */
const MapController = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target.pos, target.zoom, { duration: 1.2, easeLinearity: 0.3 });
    }
  }, [target, map]);
  return null;
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export const FacilityMap = ({ height = '480px', showSearch = true }) => {
  const { healthcareFacilities, setActiveModal, setModalData, setCurrentPage } = useApp();

  const [filter,   setFilter]   = useState('ALL');
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(null);
  const [userPos,  setUserPos]  = useState(null);
  const [locStatus, setLocStatus] = useState('idle');  // idle | asking | found | denied
  const [mapTarget, setMapTarget] = useState(null);    // { pos:[lat,lng], zoom }

  /* Ask for location once on mount */
  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocStatus('asking');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setUserPos(pos);
        setMapTarget({ pos, zoom: 14 });
        setLocStatus('found');
      },
      () => {
        setLocStatus('denied');
        setMapTarget({ pos: [26.785, 75.83], zoom: 13 });
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  }, []);

  const handleLocateMe = useCallback(() => {
    if (userPos) { setMapTarget({ pos: userPos, zoom: 15 }); return; }
    setLocStatus('asking');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setUserPos(pos);
        setMapTarget({ pos, zoom: 15 });
        setLocStatus('found');
      },
      () => setLocStatus('denied'),
      { enableHighAccuracy: true, timeout: 9000 }
    );
  }, [userPos]);

  const handlePinClick = useCallback((f) => {
    setSelected(f);
    setMapTarget({ pos: [f.lat, f.lng], zoom: 15 });
  }, []);

  /* Filtering */
  const shown = healthcareFacilities.filter(f => {
    const t = f.type.toLowerCase();
    const ok =
      filter === 'ALL' ||
      (filter === 'HOSPITAL' && !t.includes('phc') && !t.includes('chc') && !t.includes('pharmacy') && !t.includes('maternity')) ||
      (filter === 'PHC'      && (t.includes('phc') || t.includes('chc') || t.includes('maternity') || t.includes('dispensary'))) ||
      (filter === 'PHARMACY' && t.includes('pharmacy'));

    const q = query.toLowerCase();
    const matches = !q ||
      f.name.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q) ||
      f.services.some(s => s.toLowerCase().includes(q));

    return ok && matches;
  });

  /* Counts for badge */
  const counts = {
    ALL:      healthcareFacilities.length,
    HOSPITAL: healthcareFacilities.filter(f => { const t = f.type.toLowerCase(); return !t.includes('phc') && !t.includes('chc') && !t.includes('pharmacy') && !t.includes('maternity'); }).length,
    PHC:      healthcareFacilities.filter(f => { const t = f.type.toLowerCase(); return t.includes('phc') || t.includes('chc') || t.includes('maternity') || t.includes('dispensary'); }).length,
    PHARMACY: healthcareFacilities.filter(f => f.type.toLowerCase().includes('pharmacy')).length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Location status banner ── */}
      {locStatus === 'asking' && <Banner type="info" icon={<Locate size={15}/>} text="Requesting your location to show nearby facilities…" />}
      {locStatus === 'found'  && <Banner type="success" icon={<ShieldCheck size={15}/>} text="📍 Your location found. Green marker shows your position." />}
      {locStatus === 'denied' && (
        <Banner type="warn" icon={<MapPin size={15}/>}>
          Location access denied. Showing Sitapura area.{' '}
          <button onClick={handleLocateMe} style={{ fontWeight:700, color:'#1d4ed8', background:'none', border:'none', cursor:'pointer', padding:0, fontSize:'inherit' }}>
            Try again →
          </button>
        </Banner>
      )}

      {/* ── Search & Filter bar ── */}
      {showSearch && (
        <div style={{
          display:'flex', flexWrap:'wrap', gap:10, alignItems:'center',
          background:'#fff', padding:'12px 16px',
          borderRadius: locStatus !== 'idle' ? '0' : '12px 12px 0 0',
          border:'1px solid #e2e8f0', borderBottom:'none',
        }}>
          {/* Search */}
          <div style={{ position:'relative', flex:'1 1 220px' }}>
            <Search size={15} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
            <input
              type="text" placeholder="Search hospitals, PHC, medicines…"
              value={query} onChange={e => setQuery(e.target.value)}
              style={{ width:'100%', padding:'8px 10px 8px 32px', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.875rem', outline:'none', background:'#f8fafc' }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:'0.78rem', color:'#64748b', fontWeight:600 }}><Filter size={13} style={{ verticalAlign:'middle', marginRight:3 }}/>Filter:</span>
            {[
              { k:'ALL',      label:'All',       emoji:'🗺️' },
              { k:'HOSPITAL', label:'Hospitals',  emoji:'🏥' },
              { k:'PHC',      label:'PHC / CHC',  emoji:'🟢' },
              { k:'PHARMACY', label:'Pharmacy',   emoji:'💊' },
            ].map(({ k, label, emoji }) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding:'5px 12px', borderRadius:20, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', transition:'all 0.18s',
                background: filter === k ? 'var(--navy-deep)' : '#f1f5f9',
                color:       filter === k ? '#fff'           : '#475569',
                border: filter === k ? '2px solid var(--navy-deep)' : '2px solid transparent',
              }}>
                {emoji} {label} <span style={{ opacity:0.65, fontWeight:400, fontSize:'0.72rem' }}>({counts[k]})</span>
              </button>
            ))}
          </div>

          {/* Locate me */}
          <button onClick={handleLocateMe} style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'7px 14px', borderRadius:8, fontSize:'0.8rem', fontWeight:700,
            background:'#16a34a', color:'#fff', border:'none', cursor:'pointer', flexShrink:0,
          }}>
            <Locate size={14}/> Locate Me
          </button>
        </div>
      )}

      {/* ── Map ── */}
      <div style={{
        height,
        borderRadius: showSearch ? '0 0 12px 12px' : 12,
        overflow:'hidden', border:'1px solid #e2e8f0',
      }}>
        <MapContainer
          center={[26.785, 75.83]}
          zoom={13}
          scrollWheelZoom
          style={{ height:'100%', width:'100%' }}
          zoomControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapTarget && <MapController target={mapTarget} />}

          {/* User location */}
          {userPos && (
            <>
              <Marker position={userPos} icon={ICONS.user}>
                <Popup><b style={{ color:'#166534' }}>📍 Your Location</b><br/><span style={{ fontSize:'0.75rem', color:'#64748b' }}>GPS detected position</span></Popup>
              </Marker>
              <Circle center={userPos} radius={250} pathOptions={{ color:'#16a34a', fillColor:'#16a34a', fillOpacity:0.08, weight:1.5, dashArray:'4 4' }} />
            </>
          )}

          {/* Facility markers */}
          {shown.map(f => (
            <Marker key={f.id} position={[f.lat, f.lng]} icon={resolveIcon(f.type)}
              eventHandlers={{ click: () => handlePinClick(f) }}
            >
              <Popup minWidth={190}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0f172a', marginBottom:2 }}>{f.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'#0284c7', fontWeight:600, marginBottom:4 }}>{f.type}</div>
                  <div style={{ fontSize:'0.75rem', color:'#64748b', marginBottom:5 }}>{f.address}</div>
                  {f.emergency24x7 && <div style={{ fontSize:'0.72rem', color:'#dc2626', fontWeight:700, marginBottom:5 }}>🚨 24×7 Emergency</div>}
                  <a href={`tel:${f.phone}`} style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.78rem', fontWeight:700, color:'#0284c7', textDecoration:'none', marginBottom:8 }}>
                    <Phone size={11}/> {f.phone}
                  </a>
                  <button onClick={() => handlePinClick(f)} style={{ width:'100%', padding:'5px 0', background:'var(--navy-deep)', color:'#fff', border:'none', borderRadius:6, fontSize:'0.78rem', fontWeight:700, cursor:'pointer' }}>
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Count bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 16px', background:'#f8fafc', border:'1px solid #e2e8f0', borderTop:'none', borderRadius:'0 0 12px 12px', fontSize:'0.78rem', color:'#475569' }}>
        <span>Showing <b>{shown.length}</b> of <b>{healthcareFacilities.length}</b> facilities · Sitapura, Sanganer, Pratap Nagar, Beelwa</span>
        {selected && <button onClick={() => setCurrentPage('map')} style={{ fontWeight:700, color:'var(--navy-primary)', background:'none', border:'none', cursor:'pointer', fontSize:'0.78rem' }}>Open Full Map →</button>}
      </div>

      {/* ── Detail Drawer ── */}
      {selected && (
        <DetailDrawer
          f={selected}
          onClose={() => setSelected(null)}
          onBook={(f, doc) => { setModalData({ facility:f, doctor:doc }); setActiveModal('appointment'); }}
          onFullMap={() => setCurrentPage('map')}
        />
      )}
    </div>
  );
};

/* ══ Reusable banner ══ */
const Banner = ({ type, icon, text, children }) => {
  const styles = {
    info:    { bg:'#eff6ff', border:'#bfdbfe', color:'#1e3a8a' },
    success: { bg:'#f0fdf4', border:'#bbf7d0', color:'#14532d' },
    warn:    { bg:'#fffbeb', border:'#fde68a', color:'#78350f' },
  };
  const s = styles[type] || styles.info;
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:10, padding:'9px 16px', display:'flex', alignItems:'center', gap:8, fontSize:'0.85rem', color:s.color, marginBottom:0, borderBottom:'none' }}>
      {icon}{text}{children}
    </div>
  );
};

/* ══ Detail Drawer ══ */
const DetailDrawer = ({ f, onClose, onBook, onFullMap }) => {
  const t = f.type.toLowerCase();
  const isPharmacy = t.includes('pharmacy');
  const isMaternity = t.includes('maternity');

  const typeEmoji = isPharmacy ? '💊' : isMaternity ? '🤱' : t.includes('phc') ? '🏛️' : '🏥';
  const typeBadgeBg =
    isPharmacy  ? '#fef9c3' :
    isMaternity ? '#f3e8ff' :
    t.includes('phc') || t.includes('chc') ? '#dcfce7' : '#dbeafe';
  const typeBadgeColor =
    isPharmacy  ? '#92400e' :
    isMaternity ? '#6b21a8' :
    t.includes('phc') || t.includes('chc') ? '#166534' : '#1e40af';

  return (
    <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden', boxShadow:'0 12px 40px rgba(11,59,115,0.13)', marginTop:16, animation:'slideUp 0.22s ease-out' }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>

      {/* Header */}
      <div style={{ padding:'18px 22px 14px', background:'linear-gradient(135deg,#f0f7fb,#fff)', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:6 }}>
            <span style={{ fontSize:'1.5rem' }}>{typeEmoji}</span>
            <h3 style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--navy-deep)', lineHeight:1.25, margin:0 }}>{f.name}</h3>
            {f.verified && <span style={{ background:'#ecfdf5', color:'#065f46', fontSize:'0.7rem', fontWeight:700, padding:'2px 8px', borderRadius:20, flexShrink:0 }}><ShieldCheck size={10} style={{ verticalAlign:'middle', marginRight:2 }}/>Verified</span>}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:7 }}>
            <span style={{ background:typeBadgeBg, color:typeBadgeColor, fontSize:'0.7rem', fontWeight:700, padding:'3px 10px', borderRadius:20 }}>{f.type}</span>
            {f.emergency24x7 && <span style={{ background:'#fef2f2', color:'#dc2626', fontSize:'0.7rem', fontWeight:700, padding:'3px 10px', borderRadius:20 }}>🚨 24×7 Emergency</span>}
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:5, color:'#475569', fontSize:'0.83rem' }}>
            <MapPin size={13} style={{ flexShrink:0, marginTop:2 }}/>{f.address}
          </div>
        </div>
        <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'6px 10px', cursor:'pointer', fontWeight:700, color:'#475569', fontSize:'0.78rem', flexShrink:0, display:'flex', alignItems:'center', gap:4 }}>
          <X size={13}/> Close
        </button>
      </div>

      {/* Info row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, padding:'14px 22px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
        <InfoPill label="DISTANCE"       value={f.distance}  icon={<Navigation size={12}/>} />
        <InfoPill label="EMERGENCY / ICU" urgent={f.emergency24x7}
          value={f.emergency24x7 ? `24×7 · ${f.icuBedsAvailable} ICU Beds` : 'OPD Only'}
          icon={<Activity size={12}/>}
        />
        <InfoPill label="CONTACT" value={f.phone} icon={<Phone size={12}/>} phone={f.phone} />
      </div>

      <div style={{ padding:'16px 22px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Services */}
        <div>
          <SectionLabel icon={<Building2 size={13}/>} label="Services Available" />
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6 }}>
            {f.services.map((s, i) => (
              <span key={i} style={{ background:'#e0f2fe', color:'#075985', padding:'4px 11px', borderRadius:20, fontSize:'0.76rem', fontWeight:600 }}>✓ {s}</span>
            ))}
          </div>
        </div>

        {/* Doctors */}
        {f.doctors && f.doctors.length > 0 && (
          <div>
            <SectionLabel icon={<User size={13}/>} label="Doctors & Timings" />
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
              {f.doctors.map((doc, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'11px 14px', gap:10, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'#e0f2fe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>👨‍⚕️</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#0f172a' }}>{doc.name}</div>
                      <div style={{ fontSize:'0.76rem', color:'#0284c7', fontWeight:600 }}>{doc.specialty}</div>
                      <div style={{ fontSize:'0.72rem', color:'#64748b', display:'flex', alignItems:'center', gap:3, marginTop:2 }}><Clock size={10}/> {doc.available}</div>
                    </div>
                  </div>
                  {!isPharmacy && (
                    <button onClick={() => onBook(f, doc)} style={{ padding:'7px 14px', background:'var(--healthcare-green)', color:'#fff', borderRadius:8, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none', display:'flex', alignItems:'center', gap:5 }}>
                      <Calendar size={12}/> Book OPD
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', paddingTop:8, borderTop:'1px solid #f1f5f9' }}>
          <a href={`https://maps.google.com/?q=${f.lat},${f.lng}`} target="_blank" rel="noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'var(--navy-deep)', color:'#fff', borderRadius:8, fontSize:'0.82rem', fontWeight:700, textDecoration:'none' }}>
            <Navigation size={14}/> GPS Directions
          </a>
          <a href={`tel:${f.phone}`}
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'#fff', color:'var(--navy-deep)', border:'2px solid var(--navy-deep)', borderRadius:8, fontSize:'0.82rem', fontWeight:700, textDecoration:'none' }}>
            <Phone size={14}/> Call Now
          </a>
          <button onClick={onFullMap}
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'#f0f7fb', color:'var(--navy-primary)', border:'2px solid #bfdbfe', borderRadius:8, fontSize:'0.82rem', fontWeight:700, cursor:'pointer' }}>
            <MapPin size={14}/> Full Map
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ icon, label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem', fontWeight:700, color:'#0f172a' }}>
    <span style={{ color:'var(--navy-primary)' }}>{icon}</span>{label}
  </div>
);

const InfoPill = ({ label, value, icon, urgent, phone }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
    <div style={{ fontSize:'0.66rem', color:'#94a3b8', fontWeight:700, letterSpacing:'0.4px', textTransform:'uppercase' }}>{label}</div>
    {phone
      ? <a href={`tel:${phone}`} style={{ fontSize:'0.88rem', fontWeight:700, color:'#0284c7', display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}>{icon} {value}</a>
      : <div style={{ fontSize:'0.88rem', fontWeight:700, color: urgent ? '#dc2626' : 'var(--navy-deep)', display:'flex', alignItems:'center', gap:4 }}>{icon} {value}</div>
    }
  </div>
);
