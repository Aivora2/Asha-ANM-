import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Briefcase, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const SupervisorProfileModal = ({ isOpen, onClose, initialMode = 'view' }) => {
  const { user, setUser, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(initialMode === 'edit');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    profilePhoto: user?.profilePhoto || '',
    mobileNumber: user?.mobileNumber || user?.phone || '',
    email: user?.email || '',
    designation: user?.designation || 'Medical Officer In-Charge (MOIC)',
    department: user?.department || 'Directorate of Medical & Health Services',
    assignedArea: user?.assignedArea || user?.area || '',
    facilityName: user?.facilityName || '',
  });

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Profile photo must be smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch('/api/supervisor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to update profile.');
        return;
      }

      // Update global context user state
      setUser((prev) => ({
        ...prev,
        ...data.supervisor,
        name: data.supervisor.fullName,
        area: data.supervisor.assignedArea
      }));

      setSuccessMessage('Supervisor profile updated successfully!');
      showToast('Profile updated successfully.');
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMessage('');
      }, 1000);
    } catch (err) {
      console.error('Profile update network error:', err);
      setErrorMessage('Network error while saving profile. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-popup-backdrop" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div 
        className="supervisor-profile-modal-card" 
        role="dialog" 
        aria-modal="true"
        style={{
          background: '#ffffff',
          borderRadius: 20,
          maxWidth: 680,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          padding: 28
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 10, background: '#ecfdf5', color: '#059669', borderRadius: 12 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEditing ? 'Edit Supervisor Profile' : 'Official Supervisor Profile'}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Primary Healthcare Governance & Administration
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            aria-label="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: 16 }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert auth-alert-success" style={{ marginBottom: 16 }}>
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar and Immutable ID Row */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#f8fafc', padding: 16, borderRadius: 14, marginBottom: 20 }}>
            <div style={{ position: 'relative' }}>
              {formData.profilePhoto ? (
                <img 
                  src={formData.profilePhoto} 
                  alt={formData.fullName} 
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #059669' }} 
                />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
                  {(formData.fullName || 'SP').slice(0, 2).toUpperCase()}
                </div>
              )}

              {isEditing && (
                <label 
                  htmlFor="modal-photo-upload" 
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    background: '#059669',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  title="Upload New Photo"
                >
                  <Camera size={14} />
                  <input
                    id="modal-photo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Supervisor / Admin ID
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>
                  <Lock size={11} /> Immutable
                </span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                {user.supervisorId}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Authorised official credentials assigned by Rajasthan Medical Directorate
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {/* Full Name */}
            <div className="auth-form-group">
              <label className="auth-form-label">Officer Full Name</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><User size={16} /></span>
                <input
                  name="fullName"
                  type="text"
                  className="auth-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Designation */}
            <div className="auth-form-group">
              <label className="auth-form-label">Designation / Role</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><Briefcase size={16} /></span>
                <input
                  name="designation"
                  type="text"
                  className="auth-input"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="auth-form-group">
              <label className="auth-form-label">Mobile Number</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><Phone size={16} /></span>
                <input
                  name="mobileNumber"
                  type="tel"
                  className="auth-input"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-form-group">
              <label className="auth-form-label">Official Email</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><Mail size={16} /></span>
                <input
                  name="email"
                  type="email"
                  className="auth-input"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div className="auth-form-group">
              <label className="auth-form-label">Governing Department</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><Building2 size={16} /></span>
                <input
                  name="department"
                  type="text"
                  className="auth-input"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Assigned Area */}
            <div className="auth-form-group">
              <label className="auth-form-label">Assigned Sector / Block</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><MapPin size={16} /></span>
                <input
                  name="assignedArea"
                  type="text"
                  className="auth-input"
                  value={formData.assignedArea}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
          </div>

          {/* Facility Name */}
          <div className="auth-form-group" style={{ marginTop: 8 }}>
            <label className="auth-form-label">Primary Health Facility Base</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Building2 size={16} /></span>
              <input
                name="facilityName"
                type="text"
                className="auth-input"
                value={formData.facilityName}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn-auth-back"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-auth-primary"
                  disabled={loading}
                  style={{ width: 'auto', padding: '10px 24px' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-auth-primary"
                onClick={() => setIsEditing(true)}
                style={{ width: 'auto', padding: '10px 24px' }}
              >
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
