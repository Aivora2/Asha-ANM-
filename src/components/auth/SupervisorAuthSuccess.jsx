import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, Building, MapPin, Hospital, LogOut, Home, LayoutDashboard } from 'lucide-react';

export const SupervisorAuthSuccess = ({ supervisor, onGoHome, onLogout }) => {
  const { setCurrentPage } = useApp();
  return (
    <div className="auth-verified-card auth-fade-in">
      <div className="verified-icon-badge">
        <ShieldCheck size={36} />
      </div>

      <h2 className="auth-form-title" style={{ color: '#047857' }}>
        Supervisor Authentication Verified
      </h2>
      <p className="auth-form-subtitle">
        Your official credentials have been verified by the backend authentication registry.
      </p>

      {/* Supervisor Details Summary Card */}
      <div className="supervisor-details-sheet">
        <div className="detail-row">
          <span className="detail-row-label">Supervisor / Admin Name:</span>
          <span className="detail-row-val">{supervisor.fullName}</span>
        </div>

        <div className="detail-row">
          <span className="detail-row-label">Official Supervisor ID:</span>
          <span className="detail-row-val" style={{ color: '#059669', fontFamily: 'monospace' }}>
            {supervisor.supervisorId}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-row-label">Designation / Role:</span>
          <span className="detail-row-val">{supervisor.designation}</span>
        </div>

        <div className="detail-row">
          <span className="detail-row-label">Department / Agency:</span>
          <span className="detail-row-val">{supervisor.department}</span>
        </div>

        <div className="detail-row">
          <span className="detail-row-label">Assigned Beat / Block:</span>
          <span className="detail-row-val">{supervisor.assignedArea}</span>
        </div>

        <div className="detail-row">
          <span className="detail-row-label">Healthcare Facility:</span>
          <span className="detail-row-val">{supervisor.facilityName}</span>
        </div>

        <div className="detail-row">
          <span className="detail-row-label">Registered Username:</span>
          <span className="detail-row-val">@{supervisor.username}</span>
        </div>
      </div>

      {/* Phase 1 Completion Notice */}
      <div style={{
        background: '#ecfdf5',
        border: '1.5px solid #a7f3d0',
        borderRadius: 12,
        padding: '14px 16px',
        fontSize: '0.825rem',
        color: '#065f46',
        lineHeight: 1.5,
        marginBottom: 20,
        textAlign: 'left'
      }}>
        <strong>✓ Phase 1 Completed:</strong> Supervisor Login, Allowlist Authorization & Database Registration are active and secure. The full Supervisor Dashboard will be linked in Phase 2.
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          className="btn-auth-primary"
          style={{ flex: 1, margin: 0 }}
          onClick={() => setCurrentPage('supervisor-dashboard')}
        >
          <Home size={18} />
          <span>Open Supervisor Dashboard</span>
        </button>

        <button
          type="button"
          className="btn-auth-secondary"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
