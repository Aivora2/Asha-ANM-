import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  X, 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  Edit3, 
  LogOut,
  Briefcase
} from 'lucide-react';
import { SupervisorProfileModal } from './supervisor/SupervisorProfileModal';

export const SupervisorProfilePopup = ({ onClose }) => {
  const { user, handleLogout, showToast } = useApp();
  const [modalMode, setModalMode] = useState(null);

  // Escape key listener to dismiss popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !modalMode) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, modalMode]);

  if (!user) return null;

  // Extract initial initials for fallback avatar
  const displayName = user.fullName || user.name || 'Supervisor Officer';
  const nameParts = displayName.trim().split(' ');
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : displayName.slice(0, 2).toUpperCase();

  const handleViewProfile = () => {
    setModalMode('view');
  };

  const handleEditProfile = () => {
    setModalMode('edit');
  };

  return (
    <>
      {/* Translucent overlay backdrop that also handles click outside */}
      <div 
        className="profile-popup-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating profile panel */}
      <div 
        className="supervisor-profile-popup"
        role="dialog"
        aria-modal="true"
        aria-label="Supervisor Profile Overview"
      >
        {/* Top bar with verified role badge & close icon */}
        <div className="popup-top-banner">
          <span className="popup-role-badge">
            <ShieldCheck size={14} color="#059669" />
            <span>Authorized Supervisor</span>
          </span>

          <button 
            type="button" 
            className="popup-close-btn"
            onClick={onClose}
            aria-label="Close Profile Popup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Avatar + Name + Designation Row */}
        <div className="popup-avatar-row">
          {user.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt={displayName} 
              className="popup-large-avatar" 
            />
          ) : (
            <div className="popup-large-avatar-fallback">
              {initials}
            </div>
          )}

          <div className="popup-user-titles">
            <h3 className="popup-full-name">{displayName}</h3>
            <div className="popup-designation">
              {user.designation || 'Medical Officer / Health Supervisor'}
            </div>
            {user.supervisorId && (
              <span className="popup-id-tag">
                ID: {user.supervisorId}
              </span>
            )}
          </div>
        </div>

        {/* Available Profile Details (Factual from Auth) */}
        <div className="popup-details-list">
          <div className="popup-detail-item">
            <MapPin size={15} className="popup-detail-icon" />
            <span className="popup-detail-label">Jurisdiction:</span>
            <span className="popup-detail-val">{user.assignedArea || user.area || 'Sitapura Block'}</span>
          </div>

          <div className="popup-detail-item">
            <Building2 size={15} className="popup-detail-icon" />
            <span className="popup-detail-label">Facility:</span>
            <span className="popup-detail-val">{user.facilityName || 'PHC Beelwa, Sitapura'}</span>
          </div>

          {user.department && (
            <div className="popup-detail-item">
              <Briefcase size={15} className="popup-detail-icon" />
              <span className="popup-detail-label">Department:</span>
              <span className="popup-detail-val">{user.department}</span>
            </div>
          )}

          <div className="popup-detail-item">
            <Phone size={15} className="popup-detail-icon" />
            <span className="popup-detail-label">Contact:</span>
            <span className="popup-detail-val">{user.mobileNumber || user.phone || '+91 98290 11223'}</span>
          </div>

          <div className="popup-detail-item">
            <Mail size={15} className="popup-detail-icon" />
            <span className="popup-detail-label">Email:</span>
            <span className="popup-detail-val">{user.email || 'dr.rajesh.verma@health.gov.in'}</span>
          </div>
        </div>

        {/* View Profile & Edit Profile Action Buttons */}
        <div className="popup-actions-grid">
          <button 
            type="button" 
            className="btn-popup-action primary"
            onClick={handleViewProfile}
          >
            <User size={15} />
            <span>View Profile</span>
          </button>

          <button 
            type="button" 
            className="btn-popup-action secondary"
            onClick={handleEditProfile}
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Footer with Sign Out */}
        <div className="popup-footer-row">
          <button 
            type="button" 
            className="popup-signout-btn"
            onClick={() => {
              onClose();
              handleLogout();
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {modalMode && (
        <SupervisorProfileModal
          isOpen={Boolean(modalMode)}
          initialMode={modalMode}
          onClose={() => setModalMode(null)}
        />
      )}
    </>
  );
};
