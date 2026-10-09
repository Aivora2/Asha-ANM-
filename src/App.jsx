import React, { useState, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NotificationTicker } from './components/NotificationTicker';
import { SplashScreen } from './components/SplashScreen';
import { Modals } from './components/Modals';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HealthcareServicesPage } from './pages/HealthcareServicesPage';
import { HealthcareMapPage } from './pages/HealthcareMapPage';
import { GrievancesPage } from './pages/GrievancesPage';
import { ContactPage } from './pages/ContactPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { CitizenLoginPage } from './pages/CitizenLoginPage';

import { AshaDashboard } from './dashboards/AshaDashboard';
import { SupervisorDashboard } from './dashboards/SupervisorDashboard';
import { CitizenDashboard } from './dashboards/CitizenDashboard';

const MainAppContent = () => {
  const { currentPage, toastMessage } = useApp();
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('ek_asha_splash_shown');
  });

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('ek_asha_splash_shown', 'true');
  }, []);

  return (
    <div className="app-container">
      {/* Full-Screen Splash Screen Overlay */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* Global Header */}

      <Header />

      {/* Global Scrolling Notification Ticker - hidden for citizen experience */}
      {currentPage !== 'citizen-login' && currentPage !== 'citizen-dashboard' && <NotificationTicker />}

      {/* Dynamic Page Router */}
      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && <HealthcareServicesPage />}
        {currentPage === 'map' && <HealthcareMapPage />}
        {currentPage === 'grievances' && <GrievancesPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'emergency' && <EmergencyPage />}

        {/* Dashboards */}
        {currentPage === 'asha-dashboard' && <AshaDashboard />}
        {currentPage === 'supervisor-dashboard' && <SupervisorDashboard />}
        {currentPage === 'citizen-dashboard' && <CitizenDashboard />}
        {currentPage === 'citizen-login' && <CitizenLoginPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals Container */}
      <Modals />

      {/* Global Toast Alert Message */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
