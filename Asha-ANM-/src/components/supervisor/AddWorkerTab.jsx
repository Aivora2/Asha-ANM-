import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Building2, 
  Briefcase, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Camera,
  RefreshCw
} from 'lucide-react';

export const AddWorkerTab = ({ onWorkerAdded, onNavigateToList }) => {
  const { user, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    profilePhoto: '',
    gender: 'Female',
    dob: '1992-05-15',
    mobileNumber: '',
    email: '',
    designation: 'ASHA',
    customWorkerId: '',
    district: 'Jaipur',
    block: user?.assignedArea || 'Sitapura',
    facilityName: user?.facilityName || 'PHC Beelwa',
    beatArea: 'Beelwa Kalan',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdResult, setCreatedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Auto-calculated predicted username for live preview
  const getPreviewUsername = () => {
    const fName = (formData.fullName.trim().split(/\s+/)[0] || 'worker').toLowerCase().replace(/[^a-z]/g, '');
    const des = formData.designation.toLowerCase();
    return `${des}.${fName || 'worker'}.[random-id]`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Profile photo must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateId = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      customWorkerId: `${prev.designation}-JPR-${rand}`
    }));
  };

  const handleCopyUsername = () => {
    if (createdResult?.generatedUsername) {
      navigator.clipboard.writeText(createdResult.generatedUsername);
      setCopied(true);
      showToast(`Username "${createdResult.generatedUsername}" copied to clipboard!`);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.beatArea.trim()) {
      setErrorMessage('Village / Beat area is required.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch('/api/supervisor/workers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to onboard worker.');
        return;
      }

      setCreatedResult({
        workerId: data.workerId,
        generatedUsername: data.generatedUsername,
        worker: data.worker,
        message: data.message
      });

      showToast(`Worker onboarded: ${data.generatedUsername}`);
      if (onWorkerAdded) {
        onWorkerAdded(data.worker);
      }
    } catch (err) {
      console.error('Add worker request error:', err);
      setErrorMessage('Network connection error while connecting to supervisor service.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForAnother = () => {
    setCreatedResult(null);
    setCopied(false);
    setFormData((prev) => ({
      ...prev,
      fullName: '',
      profilePhoto: '',
      mobileNumber: '',
      email: '',
      customWorkerId: '',
      beatArea: 'Beelwa Kalan',
      status: 'Active'
    }));
  };

  return (
    <div className="supervisor-tab-content-wrapper">
      {/* Tab Header Card */}
      <div className="supervisor-section-header-card">
        <div className="supervisor-section-icon-box">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="supervisor-section-title">Onboard New ASHA / ANM Worker</h2>
          <p className="supervisor-section-desc">
            Register community healthcare workers into Rajasthan Primary Health Network. Unique employee IDs and secure system usernames are generated automatically.
          </p>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION BANNER (Requirement #2) */}
      {createdResult && (
        <div className="worker-onboard-success-card">
          <div className="success-banner-top">
            <div className="success-banner-icon">
              <CheckCircle2 size={32} color="#059669" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="success-banner-title">
                {createdResult.message || 'Worker Registered Successfully!'}
              </h3>
              <p className="success-banner-subtitle">
                Official employee record saved to SQLite database. Provide the auto-generated username to the worker for future login access.
              </p>
            </div>
          </div>

          <div className="success-credentials-box">
            <div className="credential-row">
              <span className="credential-label">Official Worker ID:</span>
              <span className="credential-val-tag">{createdResult.workerId}</span>
            </div>

            <div className="credential-row highlight-row">
              <div>
                <span className="credential-label">Generated System Username:</span>
                <div className="credential-val-large">{createdResult.generatedUsername}</div>
                <span className="credential-hint">
                  Auto-generated unique identifier for ASHA portal authentication.
                </span>
              </div>

              <button
                type="button"
                className={`btn-copy-username ${copied ? 'copied' : ''}`}
                onClick={handleCopyUsername}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy Username</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="success-banner-actions">
            <button
              type="button"
              className="btn-auth-back"
              onClick={handleResetForAnother}
            >
              <UserPlus size={16} />
              <span>Register Another Worker</span>
            </button>

            {onNavigateToList && (
              <button
                type="button"
                className="btn-auth-primary"
                style={{ width: 'auto' }}
                onClick={onNavigateToList}
              >
                <span>View in Worker Directory</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* REGISTRATION FORM */}
      {!createdResult && (
        <form onSubmit={handleSubmit} className="supervisor-form-card">
          {errorMessage && (
            <div className="auth-alert auth-alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <div className="form-section-block">
            <h3 className="form-section-heading">
              <User size={18} />
              <span>1. Personal & Contact Information</span>
            </h3>

            <div className="form-grid-row">
              {/* Photo Upload Thumbnail */}
              <div className="form-field-group" style={{ gridColumn: 'span 1' }}>
                <label className="auth-form-label">Profile Photo (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="worker-avatar-preview">
                    {formData.profilePhoto ? (
                      <img src={formData.profilePhoto} alt="Worker Preview" />
                    ) : (
                      <div className="worker-avatar-placeholder">
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <label htmlFor="worker-photo-input" className="btn-upload-label">
                    <Camera size={14} />
                    <span>Upload Photo</span>
                    <input
                      id="worker-photo-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-field-group">
                <label className="auth-form-label">Full Name *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><User size={16} /></span>
                  <input
                    name="fullName"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Smt. Manju Choudhary"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="form-field-group">
                <label className="auth-form-label">Gender *</label>
                <div className="auth-input-wrapper">
                  <select
                    name="gender"
                    className="auth-input"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="form-field-group">
                <label className="auth-form-label">Date of Birth</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Calendar size={16} /></span>
                  <input
                    name="dob"
                    type="date"
                    className="auth-input"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="form-field-group">
                <label className="auth-form-label">Mobile Number *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Phone size={16} /></span>
                  <input
                    name="mobileNumber"
                    type="tel"
                    className="auth-input"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="form-field-group">
                <label className="auth-form-label">Email Address (Optional)</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Mail size={16} /></span>
                  <input
                    name="email"
                    type="email"
                    className="auth-input"
                    placeholder="worker@health.rajasthan.gov.in"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Professional & Area Details */}
          <div className="form-section-block">
            <h3 className="form-section-heading">
              <Briefcase size={18} />
              <span>2. Cadre, Assignment & Facility Deployment</span>
            </h3>

            <div className="form-grid-row">
              {/* Cadre Designation */}
              <div className="form-field-group">
                <label className="auth-form-label">Worker Designation *</label>
                <div className="designation-toggle-row">
                  <button
                    type="button"
                    className={`cadre-choice-btn ${formData.designation === 'ASHA' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, designation: 'ASHA' }))}
                  >
                    <strong>ASHA</strong>
                    <span>Accredited Social Health Activist</span>
                  </button>

                  <button
                    type="button"
                    className={`cadre-choice-btn ${formData.designation === 'ANM' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, designation: 'ANM' }))}
                  >
                    <strong>ANM</strong>
                    <span>Auxiliary Nurse Midwife</span>
                  </button>
                </div>
              </div>

              {/* Worker ID / Auto-generate */}
              <div className="form-field-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="auth-form-label" style={{ margin: 0 }}>Official Worker ID</label>
                  <button
                    type="button"
                    className="btn-text-action"
                    onClick={handleGenerateId}
                  >
                    <RefreshCw size={12} />
                    <span>Auto-Generate ID</span>
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <input
                    name="customWorkerId"
                    type="text"
                    className="auth-input"
                    placeholder={`e.g. ${formData.designation}-JPR-1088 (Leave blank to auto-create)`}
                    value={formData.customWorkerId}
                    onChange={handleChange}
                  />
                </div>
                <span className="field-subtext">If blank, a unique government format ID will be created.</span>
              </div>

              {/* District */}
              <div className="form-field-group">
                <label className="auth-form-label">Assigned District *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><MapPin size={16} /></span>
                  <input
                    name="district"
                    type="text"
                    className="auth-input"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Block */}
              <div className="form-field-group">
                <label className="auth-form-label">Health Block *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><MapPin size={16} /></span>
                  <input
                    name="block"
                    type="text"
                    className="auth-input"
                    value={formData.block}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PHC / Facility */}
              <div className="form-field-group">
                <label className="auth-form-label">Associated Health Facility (PHC / CHC) *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Building2 size={16} /></span>
                  <input
                    name="facilityName"
                    type="text"
                    className="auth-input"
                    value={formData.facilityName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Village / Beat Area */}
              <div className="form-field-group">
                <label className="auth-form-label">Village / Field Beat Area *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><MapPin size={16} /></span>
                  <input
                    name="beatArea"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Beelwa Kalan / Shiv Nagar Ward 4"
                    value={formData.beatArea}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Joining Date */}
              <div className="form-field-group">
                <label className="auth-form-label">Joining Date *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Calendar size={16} /></span>
                  <input
                    name="joiningDate"
                    type="date"
                    className="auth-input"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div className="form-field-group">
                <label className="auth-form-label">Employment Status *</label>
                <div className="auth-input-wrapper">
                  <select
                    name="status"
                    className="auth-input"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active (On Duty)</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Automatic Account Preview Notice */}
          <div className="username-preview-box">
            <div className="preview-sparkle-icon">
              <Sparkles size={20} color="#059669" />
            </div>
            <div>
              <div className="preview-title">Automated Secure Credential Generation</div>
              <div className="preview-text">
                The supervisor is NOT required to manually guess or configure login credentials.
                Upon submission, a unique system username (pattern: <code>{getPreviewUsername()}</code>) will be created and displayed with a copy action.
              </div>
            </div>
          </div>

          {/* Submit Row */}
          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
              style={{ width: 'auto', padding: '12px 32px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Registering Worker in Database...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Register {formData.designation} Worker</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
