import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../data/mockData.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('ek_asha_lang') || 'EN');
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null); // null or { role: 'ASHA'|'SUPERVISOR'|'CITIZEN_NORMAL'|'CITIZEN_REGISTERED', name, phone, etc. }
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);
  
  const [patients, setPatients] = useState(mockData.patients);
  const [grievances, setGrievances] = useState(mockData.grievances);
  const [alerts, setAlerts] = useState([
    {
      id: 'alt-101',
      senderName: 'Pooja Sharma (Citizen)',
      senderType: 'Citizen SOS',
      assignedAsha: 'Sunita Devi',
      issueType: 'High Blood Pressure & Dizziness',
      location: 'Quarter B-12, Sector 3, Pratap Nagar',
      timestamp: '15 mins ago',
      priority: 'Critical',
      status: 'Active'
    }
  ]);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Active modals
  const [activeModal, setActiveModal] = useState(null); // 'priority-explanation' | 'emergency-sos' | 'notification-detail' | 'appointment' | 'clinical-note' | 'grievance-submit'
  const [modalData, setModalData] = useState(null);

  // Sync translation function
  const t = (key) => {
    if (mockData.translations[language] && mockData.translations[language][key]) {
      return mockData.translations[language][key];
    }
    return key;
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('ek_asha_lang', lang);
    
    // Trigger Google Translate Widget
    const selectField = document.querySelector('.goog-te-combo');
    if (selectField) {
      selectField.value = lang === 'HI' ? 'hi' : 'en';
      selectField.dispatchEvent(new Event('change'));
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogin = (role, extraData = {}) => {
    let defaultUser = { role, name: 'Guest User' };
    if (role === 'ASHA') {
      defaultUser = { ...mockData.ashaWorkers[0], role: 'ASHA' };
      setCurrentPage('asha-dashboard');
    } else if (role === 'SUPERVISOR') {
      defaultUser = { name: 'Dr. Rajesh Verma', role: 'SUPERVISOR', area: 'Sitapura Block' };
      setCurrentPage('supervisor-dashboard');
    } else if (role === 'CITIZEN_REGISTERED') {
      defaultUser = { name: 'Pooja Sharma', role: 'CITIZEN_REGISTERED', assignedAsha: 'Sunita Devi', phone: '+91 98291 55443' };
      setCurrentPage('citizen-dashboard');
    } else if (role === 'CITIZEN_NORMAL') {
      defaultUser = { name: 'Vikram Rathore', role: 'CITIZEN_NORMAL', phone: '+91 98295 11223' };
      setCurrentPage('citizen-dashboard');
    }
    setUser(defaultUser);
    showToast(`Logged in as ${defaultUser.name} (${role})`);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    showToast('Logged out successfully.');
  };

  // Patient Actions
  const markVisitComplete = (patientId, clinicalNotes = '') => {
    if (offlineMode) {
      setOfflineQueue(prev => [...prev, { type: 'VISIT_COMPLETE', patientId, clinicalNotes, time: new Date().toISOString() }]);
      showToast('Offline Mode: Visit saved locally. Will sync when online.');
    } else {
      setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
          return { ...p, status: 'Completed', clinicalNotes };
        }
        return p;
      }));
      showToast('Visit marked as COMPLETED successfully!');
    }
  };

  const rescheduleVisit = (patientId, newDate) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, status: 'Rescheduled', recommendedVisitWindow: `Rescheduled to ${newDate}` };
      }
      return p;
    }));
    showToast(`Visit rescheduled for patient ${patientId}`);
  };

  // Grievance submission
  const submitGrievance = (newGrievance) => {
    const created = {
      id: `GRV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      assignedOfficer: 'Health Inspector (Sitapura)',
      ...newGrievance
    };
    setGrievances(prev => [created, ...prev]);
    showToast(`Grievance ${created.id} submitted successfully!`);
    setActiveModal(null);
  };

  // SOS Emergency Trigger
  const triggerSosAlert = (alertDetails) => {
    const newAlert = {
      id: `alt-${Math.floor(100 + Math.random() * 900)}`,
      senderName: user ? user.name : alertDetails.senderName || 'Anonymous Citizen',
      senderType: user ? user.role : 'Emergency SOS',
      assignedAsha: user?.assignedAsha || 'Sunita Devi',
      location: alertDetails.location || 'Sitapura Sector 3',
      issueType: alertDetails.issueType || 'Immediate Medical Assistance Required',
      timestamp: 'Just Now',
      priority: alertDetails.priority || 'Critical',
      status: 'Active'
    };
    if (offlineMode) {
      setOfflineQueue(prev => [...prev, { type: 'SOS_ALERT', alert: newAlert }]);
      showToast('Offline SOS Alert saved locally. Dispatches on reconnect!');
    } else {
      setAlerts(prev => [newAlert, ...prev]);
      showToast('🚨 EMERGENCY SOS DISPATCHED to ASHA & Supervisor!');
    }
    setActiveModal(null);
  };

  // Toggle Offline Simulation
  const toggleOfflineMode = () => {
    const nextState = !offlineMode;
    setOfflineMode(nextState);
    if (!nextState && offlineQueue.length > 0) {
      // Reconnected -> Sync
      showToast(`⚡ ${t('data_synced')} (${offlineQueue.length} offline records pushed)`);
      setOfflineQueue([]);
    } else if (!nextState) {
      showToast('Network Re-connected.');
    } else {
      showToast('⚠️ Offline Mode Activated.');
    }
  };

  return (
    <AppContext.Provider value={{
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
      patients,
      markVisitComplete,
      rescheduleVisit,
      grievances,
      submitGrievance,
      alerts,
      triggerSosAlert,
      activeModal,
      setActiveModal,
      modalData,
      setModalData,
      toastMessage,
      showToast,
      healthcareFacilities: mockData.healthcareFacilities,
      communityStories: mockData.communityStories,
      demoStats: mockData.demoStats,
      tickerNotifications: mockData.tickerNotifications,
      ashaWorkers: mockData.ashaWorkers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
