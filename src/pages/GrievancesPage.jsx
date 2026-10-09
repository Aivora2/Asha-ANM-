import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Send, CheckCircle2, Clock, AlertCircle, PlusCircle } from 'lucide-react';

export const GrievancesPage = () => {
  const { grievances, setActiveModal } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredGrievances = grievances.filter(g => {
    if (filterStatus === 'ALL') return true;
    return g.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
            Healthcare Grievance Redressal Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Transparent grievance filing and resolution tracking for citizens, ASHA workers, and healthcare staff.
          </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => setActiveModal('grievance-submit')}
          style={{ padding: '12px 20px' }}
        >
          <PlusCircle size={18} /> File New Grievance
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10 }}>
        {['ALL', 'Submitted', 'Under Review', 'Resolved'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: '0.85rem',
              fontWeight: 700,
              background: filterStatus === s ? 'var(--navy-primary)' : '#f1f5f9',
              color: filterStatus === s ? '#fff' : '#64748b'
            }}
          >
            {s === 'ALL' ? 'All Grievances' : s}
          </button>
        ))}
      </div>

      {/* Grievance Tracker List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {filteredGrievances.map(g => {
          const isResolved = g.status === 'Resolved';
          const isReview = g.status === 'Under Review';

          return (
            <div key={g.id} className="card" style={{ borderLeft: `4px solid ${isResolved ? '#10b981' : isReview ? '#f59e0b' : '#0284c7'}` }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#153a62' }}>{g.id}</span>
                <span 
                  className={`badge ${isResolved ? 'badge-low' : isReview ? 'badge-medium' : 'badge-verified'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  {isResolved ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {g.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                {g.category}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 12 }}>
                Location: <strong>{g.location}</strong> • Filed by: <strong>{g.name}</strong> ({g.date})
              </div>

              <p style={{ fontSize: '0.875rem', color: '#334155', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 14 }}>
                "{g.description}"
              </p>

              {/* Resolution Stepper Progress */}
              <div style={{ pt: 10, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>RESOLUTION WORKFLOW:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                  <span style={{ color: '#0284c7' }}>1. Submitted ✓</span> &rarr; 
                  <span style={{ color: isReview || isResolved ? '#f59e0b' : '#94a3b8' }}>2. Under Review {isReview || isResolved ? '✓' : ''}</span> &rarr; 
                  <span style={{ color: isResolved ? '#10b981' : '#94a3b8' }}>3. Resolved {isResolved ? '✓' : ''}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                  Assigned Officer: <strong>{g.assignedOfficer || 'Health Inspector'}</strong>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
