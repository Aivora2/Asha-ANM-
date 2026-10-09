import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Briefcase, 
  Building, 
  MapPin, 
  Hospital, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Camera 
} from 'lucide-react';

export const SupervisorRegisterForm = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    profilePhoto: '',
    mobileNumber: '',
    email: '',
    supervisorId: '',
    designation: 'Medical Officer In-Charge',
    department: 'Directorate of Medical & Health Services',
    assignedArea: '',
    facilityName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Frontend pre-validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }

    const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.supervisorId.trim()) {
      setErrorMessage('Supervisor/Admin ID is required.');
      return;
    }

    if (!formData.assignedArea.trim()) {
      setErrorMessage('Assigned Area / District / Block is required.');
      return;
    }

    if (!formData.facilityName.trim()) {
      setErrorMessage('Organization / Facility Name is required.');
      return;
    }

    if (formData.username.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/supervisor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          profilePhoto: formData.profilePhoto || null,
          mobileNumber: formData.mobileNumber.trim(),
          email: formData.email.trim(),
          supervisorId: formData.supervisorId.trim(),
          designation: formData.designation.trim(),
          department: formData.department.trim(),
          assignedArea: formData.assignedArea.trim(),
          facilityName: formData.facilityName.trim(),
          username: formData.username.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Registration failed. Please check the entered details.');
        return;
      }

      setSuccessMessage('Supervisor registered successfully! Redirecting to login...');
      setTimeout(() => {
        onRegisterSuccess(data.supervisor);
      }, 1500);
    } catch (err) {
      console.error('Registration network error:', err);
      setErrorMessage('Unable to connect to authentication server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fade-in">
      <h2 className="auth-form-title">Supervisor / Admin Registration</h2>
      <p className="auth-form-subtitle">
        Register an official administrative supervisor account for block & beat healthcare governance.
      </p>

      {errorMessage && (
        <div className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="auth-alert auth-alert-success" role="alert">
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 1. PERSONAL DETAILS */}
        <div className="auth-form-section-title">
          <User size={16} /> Personal Details
        </div>

        <div className="auth-grid-2col">
          {/* Full Name */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-fullName">
              Full Name <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><User size={17} /></span>
              <input
                id="reg-fullName"
                name="fullName"
                type="text"
                className="auth-input"
                placeholder="Dr. Rajesh Verma / Officer Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Profile Photo (Optional) */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-photo">
              Profile Photo <span style={{ color: '#64748b', fontWeight: 400 }}>(Optional)</span>
            </label>
            <div className="auth-input-wrapper" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <label 
                htmlFor="reg-photo-upload" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 14px',
                  background: '#f1f5f9',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#475569',
                  width: '100%'
                }}
              >
                <Camera size={16} color="#059669" />
                <span>{formData.profilePhoto ? 'Photo Uploaded ✓' : 'Upload Officer Photo'}</span>
              </label>
              <input
                id="reg-photo-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </div>
          </div>
        </div>

        <div className="auth-grid-2col">
          {/* Mobile Number */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-mobile">
              Mobile Number <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Phone size={17} /></span>
              <input
                id="reg-mobile"
                name="mobileNumber"
                type="tel"
                className="auth-input"
                placeholder="98290XXXXX"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-email">
              Official Email Address <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Mail size={17} /></span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="auth-input"
                placeholder="officer@health.gov.in"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* 2. PROFESSIONAL DETAILS */}
        <div className="auth-form-section-title">
          <Briefcase size={16} /> Professional & Administrative Details
        </div>

        <div className="auth-grid-2col">
          {/* Supervisor / Admin ID (Strict backend verification, no list shown to user) */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-supervisorId">
              Supervisor/Admin ID <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Shield size={17} /></span>
              <input
                id="reg-supervisorId"
                name="supervisorId"
                type="text"
                className="auth-input"
                placeholder="Enter official Supervisor ID"
                value={formData.supervisorId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Designation / Role */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-designation">
              Designation / Role <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Briefcase size={17} /></span>
              <input
                id="reg-designation"
                name="designation"
                type="text"
                className="auth-input"
                placeholder="Medical Officer In-Charge / Supervisor"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="auth-grid-2col">
          {/* Department / Organization */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-department">
              Department / Organization <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Building size={17} /></span>
              <input
                id="reg-department"
                name="department"
                type="text"
                className="auth-input"
                placeholder="Directorate of Medical & Health Services"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Assigned Area / District / Block */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-area">
              Assigned Area / Block <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><MapPin size={17} /></span>
              <input
                id="reg-area"
                name="assignedArea"
                type="text"
                className="auth-input"
                placeholder="Sitapura & Beelwa Sector, Jaipur"
                value={formData.assignedArea}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Facility Name */}
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="reg-facility">
            Organization / Facility Name <span className="required-dot">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><Hospital size={17} /></span>
            <input
              id="reg-facility"
              name="facilityName"
              type="text"
              className="auth-input"
              placeholder="PHC Beelwa / CHC Sitapura / Sub-Center Hub"
              value={formData.facilityName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 3. ACCOUNT SECURITY */}
        <div className="auth-form-section-title">
          <Lock size={16} /> Account Security Credentials
        </div>

        {/* Username */}
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="reg-username">
            Official Username <span className="required-dot">*</span>
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><User size={17} /></span>
            <input
              id="reg-username"
              name="username"
              type="text"
              className="auth-input"
              placeholder="Choose unique username (min. 3 characters)"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="auth-grid-2col">
          {/* Password */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-password">
              Password <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Lock size={17} /></span>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="reg-confirmPassword">
              Confirm Password <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><Lock size={17} /></span>
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Repeat password exactly"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-auth-primary"
          disabled={loading}
          style={{ marginTop: 12 }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Validating & Registering Account...</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Create Official Supervisor Account</span>
            </>
          )}
        </button>
      </form>

      {/* Switch back to Login */}
      <div className="auth-switch-prompt">
        Already registered as Supervisor?{' '}
        <button
          type="button"
          className="auth-switch-link"
          onClick={onSwitchToLogin}
        >
          Sign In Here &rarr;
        </button>
      </div>
    </div>
  );
};
