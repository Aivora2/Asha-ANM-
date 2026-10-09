import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Activity, MapPin, HeartPulse, Send, MessageCircle } from 'lucide-react';

export const CitizenDashboard = () => {
  const { user, triggerSosAlert, showToast } = useApp();
  
  const [locationShared, setLocationShared] = useState(false);
  const [alertDesc, setAlertDesc] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const assignedAsha = {
    name: 'Sunita Devi',
    phone: '+91 98290 12345',
    address: 'Sub-Center, Sector 3, Sitapura',
    lastVisit: '6 days ago',
    nextVisit: 'Tomorrow at 10:30 AM',
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
  };

  const healthData = {
    riskScore: 65,
    riskLevel: 'Moderate',
    riskExplanation: 'Elevated blood pressure observed in last visit. Requires regular monitoring.',
    conditions: [
      { name: 'Pregnancy (3rd Trimester)', status: 'Active', treatmentDate: 'Oct 01, 2026', notes: 'Iron Folic Acid prescribed.' },
      { name: 'Hypertension', status: 'Monitoring', treatmentDate: 'Oct 01, 2026', notes: 'BP 140/90' }
    ]
  };

  const handleSendAlert = (e) => {
    e.preventDefault();
    if (!alertDesc) {
      showToast('Please describe your concern.');
      return;
    }
    triggerSosAlert({
      senderName: user ? user.name : 'Citizen',
      location: 'Home Address',
      issueType: alertDesc,
      priority: 'High'
    });
    setAlertSent(true);
    setAlertDesc('');
    setSelectedFile(null);
    showToast('Alert sent successfully!');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* ASHA Worker Details - Top Priority */}
      <div className="card" style={{ borderLeft: '6px solid var(--blue-accent)', background: '#f8fafc', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2942', marginBottom: 16 }}>Your Assigned ASHA Worker</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <img src={assignedAsha.photo} alt={assignedAsha.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--blue-accent)' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>{assignedAsha.name}</h3>
            <div style={{ fontSize: '0.95rem', color: '#334155', marginTop: 4 }}>
              <strong>Phone:</strong> {assignedAsha.phone} <br />
              <strong>Address:</strong> {assignedAsha.address}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '0.85rem', color: '#64748b' }}>
              <span>Last Visit: <strong style={{ color: '#0f2942' }}>{assignedAsha.lastVisit}</strong></span>
              <span>Next Visit: <strong style={{ color: '#0284c7' }}>{assignedAsha.nextVisit}</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', justifyContent: 'center' }} onClick={() => showToast('Message feature coming soon!')}>
              <MessageCircle size={16} /> Message ASHA
            </button>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', justifyContent: 'center' }} onClick={() => showToast('Medicine request logged!')}>
              Request Medicines
            </button>
          </div>
        </div>
      </div>

      {/* Row: Risk Score & Health Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Risk Score */}
        <div id="risk-score" className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#fef3c7', padding: 10, borderRadius: 10, color: '#d97706' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2942' }}>Risk Score</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{healthData.riskScore}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#b45309', paddingBottom: 6 }}>{healthData.riskLevel}</span>
          </div>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.5 }}>
            {healthData.riskExplanation}
          </p>
        </div>

        {/* Health Status */}
        <div id="health-status" className="card" style={{ borderTop: '4px solid var(--blue-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#e0f2fe', padding: 10, borderRadius: 10, color: '#0284c7' }}>
              <HeartPulse size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2942' }}>Health Status</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {healthData.conditions.map((cond, i) => (
              <div key={i} style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>{cond.name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '4px 10px', borderRadius: 12 }}>{cond.status}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 8 }}>Treatment: <strong style={{ color: '#334155' }}>{cond.treatmentDate}</strong></div>
                <div style={{ fontSize: '0.95rem', color: '#334155' }}>{cond.notes}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Alerts & Help */}
      <div id="alerts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b91c1c', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={20} /> Emergency Assistance
          </h3>
          <p style={{ fontSize: '1rem', color: '#475569', marginBottom: 20 }}>
            If you or a family member is experiencing a medical emergency, use the button below to immediately alert your ASHA worker.
          </p>
          <button 
            className="btn-emergency" 
            onClick={() => {
              triggerSosAlert({ senderName: user?.name, issueType: 'Critical Emergency SOS', priority: 'Critical' });
              showToast('Emergency SOS dispatched to ASHA worker.');
            }}
            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }}
          >
            🚨 EMERGENCY SOS
          </button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2942', marginBottom: 12 }}>Report New Health Concern</h3>
          {alertSent ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 20, borderRadius: 8, color: '#065f46' }}>
              <h4 style={{ fontWeight: 800, marginBottom: 8, fontSize: '1.1rem' }}>Concern Submitted</h4>
              <p style={{ fontSize: '0.95rem' }}>Your ASHA worker has been notified and will prioritize your case if needed. (Note: Offline alerts will sync when connected).</p>
              <button onClick={() => setAlertSent(false)} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, marginTop: 12, cursor: 'pointer', textDecoration: 'underline' }}>Report another concern</button>
            </div>
          ) : (
            <form onSubmit={handleSendAlert} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#334155' }}>Message to ASHA</label>
                <textarea 
                  rows={4}
                  value={alertDesc}
                  onChange={(e) => setAlertDesc(e.target.value)}
                  placeholder="Describe your health problem, symptoms, or reason for alert..."
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#334155' }}>Upload Document (PDF, DOCX, DOC)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ background: '#e2e8f0', padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: '#475569', display: 'inline-block' }}>
                    Choose File
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setSelectedFile(e.target.files[0].name);
                        }
                      }} 
                    />
                  </label>
                  <span style={{ fontSize: '0.9rem', color: selectedFile ? '#0284c7' : '#64748b', fontWeight: selectedFile ? 600 : 400 }}>
                    {selectedFile ? selectedFile : 'No file selected'}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px', marginTop: 8 }}>
                <Send size={18} /> Send Report
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Row: Location Access */}
      <div id="location" className="card" style={{ borderTop: '4px solid var(--teal-brand)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#ccfbf1', padding: 10, borderRadius: 10, color: '#0f766e' }}>
            <MapPin size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2942' }}>Location Access</h3>
        </div>
        <p style={{ fontSize: '1rem', color: '#475569', marginBottom: 20 }}>
          Allow your assigned ASHA worker to view your current location for emergency assistance and home visits.
        </p>
        
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: 4, fontSize: '1.1rem' }}>Location Sharing</div>
            <div style={{ fontSize: '0.95rem', color: locationShared ? '#059669' : '#64748b', fontWeight: 700 }}>
              {locationShared ? 'Currently Enabled' : 'Currently Disabled'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {!locationShared ? (
              <button 
                onClick={() => { setLocationShared(true); showToast('Location access granted to ASHA worker.'); }}
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
              >
                Approve Access
              </button>
            ) : (
              <button 
                onClick={() => { setLocationShared(false); showToast('Location access revoked.'); }}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
              >
                Deny Access
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
