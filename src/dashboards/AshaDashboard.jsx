import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RouteMap } from '../components/RouteMap';
import { FacilityMap } from '../components/FacilityMap';
import { UserCheck, AlertTriangle, CheckCircle, Clock, Navigation, MapPin, Search, ShieldAlert, Sparkles, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const AshaDashboard = () => {
  const { 
    user, 
    patients, 
    offlineMode, 
    toggleOfflineMode, 
    setActiveModal, 
    setModalData, 
    rescheduleVisit, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('priority-queue'); // 'priority-queue' | 'route' | 'my-patients' | 'referral-finder'
  const [patientSearch, setPatientSearch] = useState('');
  const [patientRiskFilter, setPatientRiskFilter] = useState('ALL');

  const ashaInfo = user || { name: 'Sunita Devi', beatArea: 'Sitapura Sector 3 & Beelwa' };

  // Calculate statistics
  const total = patients.length;
  const criticalCount = patients.filter(p => p.riskLevel === 'Critical').length;
  const highCount = patients.filter(p => p.riskLevel === 'High').length;
  const mediumCount = patients.filter(p => p.riskLevel === 'Medium').length;
  const lowCount = patients.filter(p => p.riskLevel === 'Low').length;
  const completedCount = patients.filter(p => p.status === 'Completed').length;
  const pendingCount = total - completedCount;

  // Sorted Priority Queue: Critical -> High -> Medium -> Low
  const prioritySortedPatients = [...patients].sort((a, b) => b.riskScore - a.riskScore);

  const filteredPatients = prioritySortedPatients.filter(p => {
    const matchRisk = patientRiskFilter === 'ALL' || p.riskLevel.toUpperCase() === patientRiskFilter.toUpperCase();
    const matchSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
      p.address.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(patientSearch.toLowerCase());
    return matchRisk && matchSearch;
  });

  const handleWhyThisPatient = (p) => {
    setModalData(p);
    setActiveModal('priority-explanation');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Top Banner: ASHA Worker Profile & Offline Simulator */}
      <div style={{ background: 'linear-gradient(135deg, #153a62 0%, #0b1e36 100%)', color: '#fff', padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img 
            src={ashaInfo.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"} 
            alt={ashaInfo.name}
            style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid #0284c7', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {ashaInfo.name}</h1>
              <span className="badge badge-verified" style={{ background: '#0284c7', color: '#fff' }}>ASHA Field Worker</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
              Assigned Beat: <strong>{ashaInfo.beatArea}</strong> • Supervisor: <strong>{ashaInfo.supervisor || 'Dr. Rajesh Verma'}</strong>
            </p>
          </div>
        </div>

        {/* Offline Mode Toggle Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: offlineMode ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
            {offlineMode ? <WifiOff size={18} /> : <Wifi size={18} />}
            <span>{offlineMode ? 'OFFLINE SIMULATOR' : 'ONLINE SYNCED'}</span>
          </div>
          <button 
            onClick={toggleOfflineMode}
            style={{ padding: '6px 12px', background: offlineMode ? '#f59e0b' : 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 }}
          >
            {offlineMode ? 'Go Online & Sync' : 'Test Offline Mode'}
          </button>
        </div>
      </div>

      {/* TODAY'S OVERVIEW STATS GRID */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 12 }}>
          Today's Field Overview
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
          <div className="card" style={{ padding: 14, textAlign: 'center', borderTop: '4px solid var(--navy-primary)' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL ASSIGNED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--navy-deep)' }}>{total}</div>
          </div>

          <div className="card" style={{ padding: 14, textAlign: 'center', borderTop: '4px solid #e11d48', background: '#fff1f2' }}>
            <div style={{ fontSize: '0.75rem', color: '#881337', fontWeight: 700 }}>🔴 CRITICAL RISK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e11d48' }}>{criticalCount}</div>
          </div>

          <div className="card" style={{ padding: 14, textAlign: 'center', borderTop: '4px solid #ea580c', background: '#fff7ed' }}>
            <div style={{ fontSize: '0.75rem', color: '#7c2d12', fontWeight: 700 }}>🟠 HIGH RISK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ea580c' }}>{highCount}</div>
          </div>

          <div className="card" style={{ padding: 14, textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.75rem', color: '#78350f', fontWeight: 700 }}>🟡 MEDIUM RISK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706' }}>{mediumCount}</div>
          </div>

          <div className="card" style={{ padding: 14, textAlign: 'center', borderTop: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.75rem', color: '#064e3b', fontWeight: 700 }}>🟢 LOW / ROUTINE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>{lowCount}</div>
          </div>

          <div className="card" style={{ padding: 14, textAlign: 'center', borderTop: '4px solid #10b981', background: '#ecfdf5' }}>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>✓ COMPLETED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669' }}>{completedCount}</div>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '2px solid #e2e8f0', pb: 2, flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('priority-queue')}
          style={{
            padding: '10px 18px',
            fontWeight: 800,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'priority-queue' ? '3px solid var(--rose-critical)' : 'none',
            color: activeTab === 'priority-queue' ? 'var(--rose-critical)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <AlertTriangle size={18} /> Who Should I Visit First? ({prioritySortedPatients.length})
        </button>

        <button 
          onClick={() => setActiveTab('route')}
          style={{
            padding: '10px 18px',
            fontWeight: 800,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'route' ? '3px solid var(--navy-primary)' : 'none',
            color: activeTab === 'route' ? 'var(--navy-primary)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Navigation size={18} /> Today's Recommended Route
        </button>

        <button 
          onClick={() => setActiveTab('my-patients')}
          style={{
            padding: '10px 18px',
            fontWeight: 800,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'my-patients' ? '3px solid var(--teal-brand)' : 'none',
            color: activeTab === 'my-patients' ? 'var(--teal-brand)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <UserCheck size={18} /> My Patients Directory
        </button>

        <button 
          onClick={() => setActiveTab('referral-finder')}
          style={{
            padding: '10px 18px',
            fontWeight: 800,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'referral-finder' ? '3px solid var(--blue-accent)' : 'none',
            color: activeTab === 'referral-finder' ? 'var(--blue-accent)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <MapPin size={18} /> Healthcare Finder / Referral
        </button>
      </div>

      {/* TAB 1: PRIORITY QUEUE ("Who Should I Visit First?") */}
      {activeTab === 'priority-queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Section Header & Explainer */}
          <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
                  Who Should I Visit First?
                </h2>
                <span className="badge badge-critical">
                  <Sparkles size={14} /> Auto Sorted by Risk Score
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Sorted dynamically: 🔴 Critical Risk &rarr; 🟠 High &rarr; 🟡 Medium &rarr; 🟢 Low
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
                <button
                  key={r}
                  onClick={() => setPatientRiskFilter(r)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 16,
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    background: patientRiskFilter === r ? 'var(--navy-primary)' : '#f1f5f9',
                    color: patientRiskFilter === r ? '#fff' : '#64748b'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Queue Patient Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {filteredPatients.map(p => {
              const isCompleted = p.status === 'Completed';

              return (
                <div 
                  key={p.id} 
                  className="card" 
                  style={{ 
                    borderLeft: `6px solid ${p.color}`, 
                    background: isCompleted ? '#f0fdf4' : '#ffffff',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span 
                        className={`badge ${
                          p.riskLevel === 'Critical' ? 'badge-critical' :
                          p.riskLevel === 'High' ? 'badge-high' :
                          p.riskLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                        }`}
                        style={{ marginBottom: 6 }}
                      >
                        {p.riskLevel} Risk
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2942' }}>{p.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {p.age} yrs, {p.gender} • {p.category}
                      </div>
                    </div>

                    {/* Risk Score Pill */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>RISK SCORE</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: p.color }}>{p.riskScore}/100</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#334155', margin: '8px 0', background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                    <strong>Condition:</strong> {p.condition}
                    {p.bp && <div style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: 700, marginTop: 2 }}>BP: {p.bp}</div>}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span>📍 Distance: <strong>{p.distanceKm} km</strong></span>
                    <span>⏱ Window: <strong style={{ color: '#e11d48' }}>{p.recommendedVisitWindow}</strong></span>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', gap: 8, pt: 10, borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleWhyThisPatient(p)}
                      style={{ fontSize: '0.775rem', padding: '6px 10px' }}
                    >
                      Why this patient first?
                    </button>

                    {isCompleted ? (
                      <span style={{ color: 'var(--emerald-success)', fontWeight: 700, fontSize: '0.85rem', padding: '6px' }}>
                        ✓ Visit Completed
                      </span>
                    ) : (
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          setModalData(p);
                          setActiveModal('clinical-note');
                        }}
                        style={{ fontSize: '0.775rem', padding: '6px 12px', background: 'var(--emerald-success)' }}
                      >
                        Complete Visit
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: ROUTE OPTIMIZATION */}
      {activeTab === 'route' && <RouteMap />}

      {/* TAB 3: MY PATIENTS DIRECTORY */}
      {activeTab === 'my-patients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search patients by name, village, or medical category..."
              value={patientSearch}
              onChange={e => setPatientSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 10, border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>Patient Name</th>
                  <th style={{ padding: '12px 16px' }}>Risk Level</th>
                  <th style={{ padding: '12px 16px' }}>Risk Score</th>
                  <th style={{ padding: '12px 16px' }}>Condition / Notes</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f2942' }}>
                      {p.name} ({p.age}y)
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>{p.address}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${p.riskLevel === 'Critical' ? 'badge-critical' : p.riskLevel === 'High' ? 'badge-high' : 'badge-low'}`}>
                        {p.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: p.color }}>
                      {p.riskScore}/100
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#334155' }}>
                      {p.condition}
                      {p.clinicalNotes && <div style={{ fontSize: '0.75rem', color: '#059669', fontStyle: 'italic' }}>Note: {p.clinicalNotes}</div>}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                      {p.status === 'Completed' ? (
                        <span style={{ color: '#10b981' }}>✓ Completed</span>
                      ) : (
                        <span style={{ color: '#ea580c' }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button 
                        onClick={() => handleWhyThisPatient(p)}
                        style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, textDecoration: 'underline' }}
                      >
                        View Risk Explanation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: HEALTHCARE FINDER / REFERRAL */}
      {activeTab === 'referral-finder' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#e0f2fe', padding: 14, borderRadius: 12, border: '1px solid #bae6fd', fontSize: '0.875rem', color: '#0369a1' }}>
            💡 <strong>ASHA Referral Assistance:</strong> Use this map to locate verified hospitals with available ICU beds, doctors, and emergency desks to refer your high-risk patients.
          </div>
          <FacilityMap height="500px" showSearch={true} />
        </div>
      )}

    </div>
  );
};
