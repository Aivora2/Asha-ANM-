import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ChevronRight } from 'lucide-react';

export const NotificationTicker = () => {
  const { language, tickerNotifications, setActiveModal, setModalData } = useApp();

  const handleTickerClick = (notif) => {
    setModalData(notif);
    setActiveModal('notification-detail');
  };

  if (!tickerNotifications || tickerNotifications.length === 0) return null;

  return (
    <div className="announcement-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 2, background: 'var(--navy-deep)', paddingRight: 12 }}>
        <Bell size={16} color="#f59e0b" className="animate-pulse" />
        <span className="announcement-tag">UPDATE</span>
      </div>

      <div className="announcement-content">
        {tickerNotifications.map((n, idx) => (
          <span 
            key={n.id || idx} 
            onClick={() => handleTickerClick(n)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 24px', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 600 }}>
              {language === 'HI' ? n.title_hi : n.title_en}
            </span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8, color: '#38bdf8' }}>
              ({n.date})
            </span>
            <ChevronRight size={14} />
          </span>
        ))}
      </div>
    </div>
  );
};
