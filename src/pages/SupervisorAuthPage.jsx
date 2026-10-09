import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, ArrowLeft, UserCheck, Users } from 'lucide-react';
import { RoleSelector } from '../components/auth/RoleSelector';
import { SupervisorLoginForm } from '../components/auth/SupervisorLoginForm';
import { SupervisorRegisterForm } from '../components/auth/SupervisorRegisterForm';
import { SupervisorAuthSuccess } from '../components/auth/SupervisorAuthSuccess';
import '../styles/supervisor-auth.css';

export const SupervisorAuthPage = () => {
  const { setCurrentPage, setUser, showToast } = useApp();

  // State: selected role in the tabs ('SUPERVISOR' | 'ASHA' | 'USER')
  const [selectedRole, setSelectedRole] = useState('SUPERVISOR');
  
  // State: hovered role for dynamic lighting/color transitions ('supervisor' | 'asha' | 'user' | null)
  const [hoverRole, setHoverRole] = useState(null);

  // State: auth mode ('login' | 'register' | 'authenticated')
  const [authMode, setAuthMode] = useState('login');

  // Authenticated supervisor profile
  const [authenticatedSupervisor, setAuthenticatedSupervisor] = useState(null);

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleLoginSuccess = (supervisor, token) => {
    // Store token in localStorage
    if (token) {
      localStorage.setItem('ek_asha_supervisor_token', token);
    }
    // Update global app state so header and user info reflect supervisor login
    setUser({
      ...supervisor,
      name: supervisor.fullName,
      role: 'SUPERVISOR',
      area: supervisor.assignedArea,
    });
    setAuthenticatedSupervisor(supervisor);
    setCurrentPage('supervisor-dashboard');
    showToast(`Welcome, ${supervisor.fullName}! Supervisor authentication verified.`);
  };

  const handleRegisterSuccess = (supervisor) => {
    showToast(`Registration completed for ${supervisor.fullName}. Please sign in.`);
    setAuthMode('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('ek_asha_supervisor_token');
    setUser(null);
    setAuthenticatedSupervisor(null);
    setAuthMode('login');
    showToast('Signed out of supervisor portal.');
  };

  const handleExternalRoleLogin = (role) => {
    if (role === 'ASHA') {
      setUser({ role: 'ASHA', name: 'Sunita Devi (ASHA Worker)' });
      setCurrentPage('asha-dashboard');
      showToast('Switched to ASHA Worker Portal');
    } else {
      setUser({ role: 'CITIZEN_REGISTERED', name: 'Pooja Sharma', assignedAsha: 'Sunita Devi', phone: '+91 98291 55443' });
      setCurrentPage('citizen-dashboard');
      showToast('Switched to Citizen Portal (ASHA Registered)');
    }
  };

  return (
    <div className="supervisor-auth-page">
      {/* Fullscreen Hero Background Image (Recognizable clinic & supervisor setting) */}
      <div className="supervisor-auth-bg" />
      <div className="supervisor-auth-overlay" />

      {/* Floating Center Card */}
      <div 
        className={`supervisor-auth-container ${authMode === 'register' ? 'register-mode' : ''} ${hoverRole ? `hover-${hoverRole}` : ''}`}
      >
        {/* Card Topbar */}
        <div className="auth-card-topbar">
          <div className="auth-brand-badge">
            <Shield size={15} />
            <span>EK ASHA AUTHENTICATION</span>
          </div>

          <button 
            type="button" 
            className="btn-auth-back"
            onClick={handleBackToHome}
            title="Return to Main Home Page"
          >
            <ArrowLeft size={14} />
            <span>Back to Portal</span>
          </button>
        </div>

        {/* 3 Role Options with Interactive Dynamic Hover Themes */}
        <RoleSelector
          selectedRole={selectedRole}
          onSelectRole={(role) => {
            setSelectedRole(role);
            if (role === 'SUPERVISOR' && authMode !== 'authenticated') {
              setAuthMode('login');
            }
          }}
          onHoverRole={setHoverRole}
        />

        {/* Dynamic Content based on selected role */}
        {selectedRole === 'SUPERVISOR' ? (
          <>
            {authMode === 'authenticated' && authenticatedSupervisor ? (
              <SupervisorAuthSuccess
                supervisor={authenticatedSupervisor}
                onGoHome={handleBackToHome}
                onLogout={handleLogout}
              />
            ) : authMode === 'register' ? (
              <SupervisorRegisterForm
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            ) : (
              <SupervisorLoginForm
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            )}
          </>
        ) : selectedRole === 'ASHA' ? (
          <div className="alternate-role-card">
            <div style={{ display: 'inline-flex', padding: 12, borderRadius: 50, background: '#faf5ff', color: '#9333ea', marginBottom: 12 }}>
              <UserCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#581c87', marginBottom: 8 }}>
              ASHA / ANM Field Worker Portal
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: 20 }}>
              Field worker accounts and beat schedules are centrally managed by primary healthcare supervisors.
            </p>
            <button
              type="button"
              className="btn-auth-primary"
              style={{ background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)' }}
              onClick={() => handleExternalRoleLogin('ASHA')}
            >
              Continue to ASHA Worker Portal
            </button>
          </div>
        ) : (
          <div className="alternate-role-card">
            <div style={{ display: 'inline-flex', padding: 12, borderRadius: 50, background: '#f0f9ff', color: '#0284c7', marginBottom: 12 }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0c4a6e', marginBottom: 8 }}>
              Citizen Portal (ASHA Registered)
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: 20 }}>
              Access maternal & infant care schedules, view assigned ASHA worker details, and request healthcare support.
            </p>
            <button
              type="button"
              className="btn-auth-primary"
              style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
              onClick={() => handleExternalRoleLogin('USER')}
            >
              Continue to Citizen Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
