import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FacilityMap } from '../components/FacilityMap';
import { Users, PhoneCall, Calendar, Heart, ShieldAlert, CheckCircle2, Clock, PlusCircle, AlertTriangle } from 'lucide-react';

export const CitizenDashboard = () => {
  const { user, triggerSosAlert, setActiveModal, showToast } = useApp();
  const isRegistered = user?.role === 'CITIZEN_REGISTERED';

  const [activeTab, setActiveTab] = useState('my-asha'); // 'my-asha' | 'family' | 'nearby' | 'appointments'

  const assignedAsha = {
    name: 'Sunita Devi',
    role: 'ASHA Worker (Beat 4, Sitapura)',
    phone: '+91 98290 12345',
    lastVisit: '6 days ago',
    nextVisit: 'Tomorrow at 10:30 AM',
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
  };

  const familyMembers = [
    { id: 'f1', name: 'Pooja Sharma', relation: 'Self (Mother)', age: 26, status: 'Pregnancy 34 Weeks (High BP)', nextCheckup: 'Oct 10, 2026' },
    { id: 'f2', name: 'Aarav Sharma', relation: 'Child (Infant)', age: 1, status: 'SAM Follow-up / Pentavalent Booster Due', nextCheckup: 'Oct 12, 2026' },
    { id: 'f3', name: 'Ramdev Sharma', relation: 'Father-in-law (Elderly)', age: 72, status: 'Diabetic Post-Stroke Care', nextCheckup: 'Oct 15, 2026' }
  ];

  const handleAlertAsha = (issue) => {
    triggerSosAlert({
      senderName: user ? user.name : 'Pooja Sharma (Citizen)',
      location: 'Quarter B-12, Sector 3, Pratap Nagar',
      issueType: issue,
      priority: 'Critical'
    });
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Citizen Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #153a62 100%)', color: '#fff', padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome, {user ? user.name : 'Pooja Sharma'}</h1>
            <span className="badge badge-verified" style={{ background: '#fff', color: '#0284c7' }}>
              {isRegistered ? 'ASHA-Registered Citizen' : 'Public Citizen'}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#e0f2fe' }}>
            Sitapura Sector 3 • Assigned ASHA Hub: <strong>PHC Beelwa</strong>
          </p>
        </div>

        {/* 🚨 NEED HELP FROM MY ASHA DIRECT SOS BUTTON */}
        {isRegistered && (
          <button 
            className="btn-emergency" 
            onClick={() => handleAlertAsha('Urgent Health Issue / Home Visit Required')}
            style={{ padding: '12px 20px', fontSize: '1rem' }}
          >
            <ShieldAlert size={20} /> 🚨 NEED HELP FROM MY ASHA
          </button>
        )}
      </div>

      {/* DASHBOARD TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '2px solid #e2e8f0', pb: 2, flexWrap: 'wrap' }}>
        {isRegistered && (
          <button 
            onClick={() => setActiveTab('my-asha')}
            style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'my-asha' ? '3px solid var(--blue-accent)' : 'none', color: activeTab === 'my-asha' ? 'var(--blue-accent)' : '#64748b' }}
          >
            My Assigned ASHA Worker
          </button>
        )}

        {isRegistered && (
          <button 
            onClick={() => setActiveTab('family')}
            style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'family' ? '3px solid var(--teal-brand)' : 'none', color: activeTab === 'family' ? 'var(--teal-brand)' : '#64748b' }}
          >
            My Family Health Management ({familyMembers.length})
          </button>
        )}

        <button 
          onClick={() => setActiveTab('nearby')}
          style={{ padding: '10px 18px', fontWeight: 800, fontSize: '0.95rem', borderBottom: activeTab === 'nearby' ? '3px solid var(--navy-primary)' : 'none', color: activeTab === 'nearby' ? 'var(--navy-primary)' : '#64748b' }}
        >
          Nearby Healthcare Facilities & Doctors
        </button>
      </div>

      {/* TAB 1: MY ASSIGNED ASHA WORKER (TYPE 2 REGISTERED CITIZEN) */}
      {isRegistered && activeTab === 'my-asha' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          
          <div className="card" style={{ borderLeft: '6px solid var(--blue-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <img src={assignedAsha.photo} alt={assignedAsha.name} style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--blue-accent)' }} />
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2942' }}>{assignedAsha.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700 }}>{assignedAsha.role}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>Phone: <strong>{assignedAsha.phone}</strong></div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', marginBottom: 20 }}>
              <div>Last Home Visit: <strong>{assignedAsha.lastVisit}</strong></div>
              <div>Scheduled Next Visit: <strong style={{ color: '#0284c7' }}>{assignedAsha.nextVisit}</strong></div>
            </div>

            {/* QUICK SOS ACTIONS */}
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f2942', marginBottom: 10 }}>Quick Help Request:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button 
                className="btn-secondary"
                onClick={() => handleAlertAsha('Severe Health Issue / Sudden Symptoms')}
                style={{ fontSize: '0.8rem', justifyContent: 'center' }}
              >
                🩺 Health Crisis
              </button>
              <button 
                className="btn-secondary"
                onClick={() => handleAlertAsha('Medicine / Supplement Supply Request')}
                style={{ fontSize: '0.8rem', justifyContent: 'center' }}
              >
                💊 Medicine Request
              </button>
            </div>
          </div>

          <div className="card" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#064e3b', marginBottom: 10 }}>
              Maternal & Infant Care Schedule
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#047857', marginBottom: 16 }}>
              Your home visit schedule is dynamically prioritized on Sunita Devi's ASHA dashboard. High BP or fever logs immediately elevate your visit priority window.
            </p>
            <button className="btn-primary" onClick={() => setActiveModal('appointment')} style={{ width: '100%', justifyContent: 'center' }}>
              Book Hospital Doctor Consultation
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: MY FAMILY MANAGEMENT */}
      {isRegistered && activeTab === 'family' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {familyMembers.map(m => (
            <div key={m.id} className="card" style={{ borderLeft: '4px solid var(--teal-brand)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942' }}>{m.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>{m.relation} • Age: {m.age}</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: '0.85rem', color: '#334155', margin: '10px 0' }}>
                <strong>Current Status:</strong> {m.status}
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Next Checkup: <strong style={{ color: '#0f2942' }}>{m.nextCheckup}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: NEARBY HEALTHCARE FACILITIES */}
      {activeTab === 'nearby' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 16 }}>Sitapura Healthcare Centers Map</h3>
          <FacilityMap height="450px" showSearch={true} />
        </div>
      )}

    </div>
  );
};
