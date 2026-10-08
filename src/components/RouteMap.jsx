import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigation, CheckCircle, Clock, AlertTriangle, MapPin, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const RouteMap = () => {
  const { patients, markVisitComplete, setActiveModal, setModalData, showToast } = useApp();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Filter pending/active visits sorted by priority sequence
  const sortedRoute = [...patients].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const currentPatient = sortedRoute[activeStepIndex] || sortedRoute[0];

  const totalDistance = sortedRoute.reduce((sum, p) => sum + p.distanceKm, 0).toFixed(1);
  const timeSavedMins = 45;

  const handleMarkArrived = (patient) => {
    showToast(`Arrived at ${patient.name}'s location (${patient.address}).`);
  };

  const handleCompleteVisitModal = (patient) => {
    setModalData(patient);
    setActiveModal('clinical-note');
  };

  const handleTriggerEmergency = (patient) => {
    setModalData({
      senderName: `ASHA Visit to ${patient.name}`,
      location: patient.address,
      issueType: `Critical Emergency Escalation: ${patient.condition}`,
      priority: 'Critical'
    });
    setActiveModal('emergency-sos');
  };

  return (
    <div className="card" style={{ borderTop: '4px solid var(--navy-primary)' }}>
      {/* Route Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-deep)', fontWeight: 800 }}>
              Today's Recommended Route
            </h3>
            <span className="badge badge-verified" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
              <Sparkles size={14} /> Risk-Optimized Algorithm
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Sequenced by: <strong style={{ color: '#e11d48' }}>Clinical Risk Score</strong> &rarr; Travel Efficiency &rarr; Time Windows
          </p>
        </div>

        {/* Efficiency Summary Badges */}
        <div style={{ display: 'flex', gap: 12, background: '#f8fafc', padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>TOTAL ROUTE DISTANCE</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{totalDistance} km</div>
          </div>
          <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: 12 }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ESTIMATED TIME SAVED</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emerald-success)' }}>~{timeSavedMins} Mins</div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Route Sequence Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 16, marginBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
        
        {/* ASHA Hub Origin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-primary)', color: '#fff', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
            HUB
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f2942' }}>PHC Beelwa</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Start 08:30 AM</div>
          </div>
        </div>

        <ArrowRight size={18} color="#94a3b8" style={{ margin: '0 12px', flexShrink: 0 }} />

        {/* Patient Route Steps */}
        {sortedRoute.map((p, idx) => {
          const isSelected = activeStepIndex === idx;
          const isCompleted = p.status === 'Completed';

          return (
            <React.Fragment key={p.id}>
              <div 
                onClick={() => setActiveStepIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  borderRadius: 12,
                  background: isSelected ? 'var(--navy-deep)' : isCompleted ? '#f0fdf4' : '#ffffff',
                  border: `2px solid ${isSelected ? 'var(--blue-accent)' : isCompleted ? '#86efac' : p.color}`,
                  color: isSelected ? '#ffffff' : '#0f172a',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(11, 30, 54, 0.2)' : 'none'
                }}
              >
                <div 
                  style={{ 
                    width: 26, 
                    height: 26, 
                    borderRadius: '50%', 
                    background: isCompleted ? 'var(--emerald-success)' : p.color, 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justify: 'center', 
                    fontWeight: 800, 
                    fontSize: '0.75rem' 
                  }}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.7 }}>
                    Score: {p.riskScore}/100 • {p.distanceKm} km
                  </div>
                </div>
              </div>

              {idx < sortedRoute.length - 1 && (
                <ArrowRight size={18} color="#94a3b8" style={{ margin: '0 8px', flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Route Step Details & Field Actions */}
      {currentPatient && (
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span className="badge" style={{ background: currentPatient.color, color: '#fff', fontWeight: 800 }}>
                  STOP {activeStepIndex + 1} of {sortedRoute.length}
                </span>
                <span 
                  className={`badge ${
                    currentPatient.riskLevel === 'Critical' ? 'badge-critical' :
                    currentPatient.riskLevel === 'High' ? 'badge-high' :
                    currentPatient.riskLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                  }`}
                >
                  {currentPatient.riskLevel} Risk (Score: {currentPatient.riskScore}/100)
                </span>
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2942' }}>{currentPatient.name} ({currentPatient.age} yrs, {currentPatient.gender})</h4>
              <p style={{ color: '#64748b', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={16} color="#e11d48" /> {currentPatient.address}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>RECOMMENDED VISIT WINDOW</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e11d48', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <Clock size={16} /> {currentPatient.recommendedVisitWindow}
              </div>
            </div>
          </div>

          <div style={{ margin: '14px 0', padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#153a62', marginBottom: 4 }}>Clinical Reason & Priority Factors:</div>
            <div style={{ fontSize: '0.875rem', color: '#334155' }}>{currentPatient.reasonSummary}</div>
          </div>

          {/* Field Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, pt: 8 }}>
            <a 
              href={`https://maps.google.com/?q=${currentPatient.lat},${currentPatient.lng}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-primary" 
              style={{ fontSize: '0.85rem' }}
            >
              <Navigation size={16} /> Navigate GPS
            </a>

            <button 
              className="btn-secondary" 
              onClick={() => handleMarkArrived(currentPatient)}
              style={{ fontSize: '0.85rem' }}
            >
              <MapPin size={16} color="#0284c7" /> Mark Arrived
            </button>

            {currentPatient.status !== 'Completed' ? (
              <button 
                className="btn-primary" 
                onClick={() => handleCompleteVisitModal(currentPatient)}
                style={{ background: 'var(--emerald-success)', fontSize: '0.85rem' }}
              >
                <CheckCircle size={16} /> Complete & Add Clinical Note
              </button>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--emerald-success)', fontWeight: 700, fontSize: '0.9rem', padding: '8px 12px' }}>
                ✓ Visit Completed
              </span>
            )}

            <button 
              className="btn-emergency" 
              onClick={() => handleTriggerEmergency(currentPatient)}
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              <ShieldAlert size={16} /> Emergency Hospital Escalation
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
