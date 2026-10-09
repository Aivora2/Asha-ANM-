import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, UserCheck, Shield, Users, Menu, X, ChevronDown, PhoneCall, AlertTriangle, LogOut, ShieldCheck } from 'lucide-react';
import { SupervisorProfilePopup } from './SupervisorProfilePopup';

export const Header = () => {
  const { 
    language, 
    toggleLanguage, 
    t, 
    currentPage, 
    setCurrentPage, 
    user, 
    handleLogin, 
    handleLogout, 
    offlineMode, 
    toggleOfflineMode,
    supervisorProfilePopupOpen,
    setSupervisorProfilePopupOpen
  } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { key: 'home', label: t('nav_home') },
    { key: 'about', label: t('nav_about') },
    { key: 'services', label: t('nav_services') },
    { key: 'map', label: t('nav_map') },
    { key: 'grievances', label: t('nav_grievances') },
    { key: 'contact', label: t('nav_contact') },
  ];

  const handleNavClick = (key) => {
    setCurrentPage(key);
    setMobileOpen(false);
  };

  const handleRoleSelect = (role) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    if (role === 'SUPERVISOR') {
      setCurrentPage('supervisor-auth');
    } else {
      handleLogin(role);
    }
  };

  return (
    <header className="header-nav">
      {offlineMode && (
        <div className="offline-banner">
          <AlertTriangle size={16} />
          <span>{t('offline_mode')} - Pending changes saved locally</span>
          <button onClick={toggleOfflineMode} style={{ textDecoration: 'underline', color: '#fff', marginLeft: 10 }}>
            Go Online
          </button>
        </div>
      )}
      
      <div className="nav-container">
        {/* Logo */}
        <div className="brand-logo" onClick={() => setCurrentPage('home')}>
          <div className="logo-badge">
            <Heart size={24} fill="#ffffff" />
          </div>
          <div>
            <div className="brand-title">{t('brand_name')}</div>
            <div className="brand-tagline">{t('tagline')}</div>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.key}>
              <button
                className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-toggle">
            <button
              className={`lang-btn ${language === 'EN' ? 'active' : ''}`}
              onClick={() => toggleLanguage('EN')}
            >
              EN
            </button>
            <button
              className={`lang-btn ${language === 'HI' ? 'active' : ''}`}
              onClick={() => toggleLanguage('HI')}
            >
              हिंदी
            </button>
          </div>

          {/* Emergency SOS direct button */}
          <button 
            className="btn-emergency"
            onClick={() => setCurrentPage('emergency')}
            title="Emergency Assistance"
          >
            <PhoneCall size={18} />
            <span>{t('nav_emergency')}</span>
          </button>

          {/* User / Login Dropdown */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.role === 'SUPERVISOR' ? (
                <div className="supervisor-profile-control-wrapper">
                  <button 
                    type="button"
                    className={`supervisor-profile-pill-btn ${supervisorProfilePopupOpen ? 'active' : ''}`}
                    onClick={() => setSupervisorProfilePopupOpen(!supervisorProfilePopupOpen)}
                    title="Supervisor Profile & Administrative Overview"
                    aria-label="Supervisor Profile & Settings"
                  >
                    {user.profilePhoto ? (
                      <img 
                        src={user.profilePhoto} 
                        alt={user.fullName || user.name} 
                        className="supervisor-pill-avatar"
                      />
                    ) : (
                      <div className="supervisor-pill-avatar-fallback">
                        <ShieldCheck size={16} />
                      </div>
                    )}
                    <div className="supervisor-pill-name-box">
                      <span className="supervisor-pill-name">
                        {user.fullName ? user.fullName.split(' ')[0] : (user.name ? user.name.split(' ')[0] : 'Supervisor')}
                      </span>
                      <span className="supervisor-pill-role">Supervisor</span>
                    </div>
                    <ChevronDown size={14} className="supervisor-pill-chevron" />
                  </button>

                  {/* Animated Profile Overview Popup */}
                  {supervisorProfilePopupOpen && (
                    <SupervisorProfilePopup onClose={() => setSupervisorProfilePopupOpen(false)} />
                  )}
                </div>
              ) : (
                <button 
                  className="btn-primary"
                  onClick={() => {
                    if (user.role === 'ASHA') setCurrentPage('asha-dashboard');
                    else setCurrentPage('citizen-dashboard');
                  }}
                >
                  <UserCheck size={18} />
                  <span>{user.name.split(' ')[0]}</span>
                </button>
              )}

              <button 
                onClick={handleLogout} 
                title="Logout" 
                style={{ padding: 8, borderRadius: 8, background: '#f1f5f9', color: '#64748b' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="login-dropdown-wrapper">
              <button 
                className="btn-primary"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{t('nav_login')}</span>
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => handleRoleSelect('SUPERVISOR')}>
                    <Shield size={18} color="#153a62" />
                    <span>{t('login_supervisor')}</span>
                  </button>
                  <button className="dropdown-item" onClick={() => handleRoleSelect('ASHA')}>
                    <UserCheck size={18} color="#0284c7" />
                    <span>{t('login_asha')}</span>
                  </button>
                  <button className="dropdown-item" onClick={() => handleRoleSelect('CITIZEN_REGISTERED')}>
                    <Users size={18} color="#10b981" />
                    <span>{t('login_citizen')} (ASHA Registered)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="hamburger-btn" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', pb: 12 }}>
          <div className="brand-title">{t('brand_name')}</div>
          <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
              style={{ textAlign: 'left', fontSize: '1.05rem', padding: '12px' }}
              onClick={() => handleNavClick(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>Select Role Login:</div>
          <button className="btn-secondary" onClick={() => handleRoleSelect('SUPERVISOR')}>
            <Shield size={18} /> {t('login_supervisor')}
          </button>
          <button className="btn-secondary" onClick={() => handleRoleSelect('ASHA')}>
            <UserCheck size={18} /> {t('login_asha')}
          </button>
          <button className="btn-secondary" onClick={() => handleRoleSelect('CITIZEN_REGISTERED')}>
            <Users size={18} /> {t('login_citizen')} (ASHA Registered)
          </button>
        </div>
      </div>
    </header>
  );
};
