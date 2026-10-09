import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FacilityMap } from '../components/FacilityMap';
import { Shield, Users, AlertTriangle, CheckCircle, RefreshCw, BarChart2, MapPin, UserCheck, ShieldAlert } from 'lucide-react';

export const SupervisorDashboard = () => {
  const { ashaWorkers, patients, alerts, grievances, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'workers' | 'patients' | 'reassign' | 'reports'
  const [selectedWorkerForReassign, setSelectedWorkerForReassign] = useState('');

  const totalWorkers = ashaWorkers.length;
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.riskLevel === 'Critical').length;
  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;

  const handleReassign = (patientName) => {
    if (!selectedWorkerForReassign) {
      showToast('Please select a target ASHA worker for reassignment');
      return;
    }
    showToast(`Reassigned ${patientName} to ${selectedWorkerForReassign} successfully!`);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Supervisor Header */}
      <div style={{ background: 'linear-gradient(135deg, #0b1e36 0%, #153a62 100%)', color: '#fff', padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Supervisor Dashboard</h1>
            <span className="badge badge-verified" style={{ background: '#0284c7', color: '#fff' }}>Sitapura Health Block</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            Officer: <strong>Dr. Rajesh Verma</strong> (MOIC / ANM Supervisor) • Sitapura & Beelwa Sector
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: 10, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>ACTIVE ALERTS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f43f5e' }}>{activeAlertsCount} SOS</div>
          </div>
        </div>
      </div>

      {/* OVERVIEW STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <div className="card" style={{ borderTop: '4px solid var(--navy-primary)' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>ASHA WORKERS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--navy-deep)' }}>{totalWorkers}</div>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--blue-accent)' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL PATIENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--navy-deep)' }}>{totalPatients}</div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #e11d48', background: '#fff1f2' }}>
          <div style={{ fontSize: '0.75rem', color: '#881337', fontWeight: 700 }}>🔴 CRITICAL CASES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e11d48' }}>{criticalPatients}</div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #10b981', background: '#ecfdf5' }}>
          <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>VISIT COMPLIANCE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669' }}>96.4%</div>
        </div>
      </div>

      {/* SOS ALERTS BANNER IF ANY ACTIVE */}
      {alerts.length > 0 && (
        <div style={{ background: '#fff1f2', border: '2px solid #fecdd3', padding: 16, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e11d48', fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>
            <ShieldAlert size={22} /> Real-Time Citizen / ASHA SOS Emergency Alerts ({alerts.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(a => (
              <div key={a.id} style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#9f1239' }}>{a.senderName} ({a.senderType})</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    Issue: <strong>{a.issueType}</strong> • Location: <strong>{a.location}</strong> ({a.timestamp})
                  </div>
                </div>
                <span className="badge badge-critical">Dispatch 108</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DASHBOARD TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '2px solid #e2e8f0', pb: 2, flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'overview' ? '3px solid var(--navy-primary)' : 'none', color: activeTab === 'overview' ? 'var(--navy-primary)' : '#64748b' }}
        >
          Overview & Sector Map
        </button>

        <button 
          onClick={() => setActiveTab('workers')}
          style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'workers' ? '3px solid var(--blue-accent)' : 'none', color: activeTab === 'workers' ? 'var(--blue-accent)' : '#64748b' }}
        >
          Worker Management ({ashaWorkers.length})
        </button>

        <button 
          onClick={() => setActiveTab('patients')}
          style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'patients' ? '3px solid var(--rose-critical)' : 'none', color: activeTab === 'patients' ? 'var(--rose-critical)' : '#64748b' }}
        >
          Patient Risk Monitoring ({patients.length})
        </button>

        <button 
          onClick={() => setActiveTab('reassign')}
          style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'reassign' ? '3px solid #f59e0b' : 'none', color: activeTab === 'reassign' ? '#f59e0b' : '#64748b' }}
        >
          Missed Visit Reassignment
        </button>

        <button 
          onClick={() => setActiveTab('reports')}
          style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'reports' ? '3px solid var(--teal-brand)' : 'none', color: activeTab === 'reports' ? 'var(--teal-brand)' : '#64748b' }}
        >
          Analytics & Performance Reports
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SECTOR MAP */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>Sitapura Beat & Facility Cluster Map</h3>
          <FacilityMap height="450px" showSearch={false} />
        </div>
      )}

      {/* TAB 2: WORKER MANAGEMENT */}
      {activeTab === 'workers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {ashaWorkers.map(w => (
            <div key={w.id} className="card" style={{ borderLeft: '4px solid var(--blue-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <img src={w.photo} alt={w.name} style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942' }}>{w.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>{w.role}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Beat: {w.beatArea}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>ASSIGNED</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{w.totalAssignedPatients}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>TODAY COMPLETED</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>{w.completedVisitsToday}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>COMPLIANCE</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0284c7' }}>{w.complianceRate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PATIENT RISK MONITORING */}
      {activeTab === 'patients' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 16 }}>Master Patient Risk Register</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: 12 }}>Patient Name</th>
                <th style={{ padding: 12 }}>Category</th>
                <th style={{ padding: 12 }}>Risk Score</th>
                <th style={{ padding: 12 }}>Assigned ASHA</th>
                <th style={{ padding: 12 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{p.name} ({p.age}y)</td>
                  <td style={{ padding: 12 }}>{p.category}</td>
                  <td style={{ padding: 12, fontWeight: 800, color: p.color }}>{p.riskScore}/100</td>
                  <td style={{ padding: 12 }}>Sunita Devi</td>
                  <td style={{ padding: 12 }}>
                    <span className={`badge ${p.status === 'Completed' ? 'badge-low' : 'badge-critical'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: MISSED VISIT REASSIGNMENT */}
      {activeTab === 'reassign' && (
        <div className="card" style={{ background: '#fff' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2942', marginBottom: 12 }}>Reassign High Priority Visits</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 20 }}>
            Reassign pending visits from overloaded or absent ASHA workers to balance field workload.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {patients.filter(p => p.riskLevel === 'Critical' || p.missedVisits > 0).map(p => (
              <div key={p.id} style={{ border: '1px solid #cbd5e1', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f2942' }}>{p.name} ({p.riskLevel} Risk - Score: {p.riskScore}/100)</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.condition} • {p.address}</div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select 
                    value={selectedWorkerForReassign} 
                    onChange={e => setSelectedWorkerForReassign(e.target.value)}
                    style={{ padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="">Select Target Worker...</option>
                    <option value="Anita Sharma (ANM)">Anita Sharma (ANM - Pratap Nagar)</option>
                    <option value="Maya Meena (ASHA)">Maya Meena (ASHA - Beelwa)</option>
                  </select>

                  <button className="btn-primary" onClick={() => handleReassign(p.name)} style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                    Reassign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 16 }}>
            Sector Visit Completion & Compliance Metrics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: '#153a62', marginBottom: 8 }}>Maternal Priority Compliance</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>98.2%</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>3rd trimester pregnant mothers visited within 24h</div>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: '#153a62', marginBottom: 8 }}>Route Travel Efficiency Gain</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0284c7' }}>+38.5%</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Km saved per worker shift vs unoptimized lists</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
