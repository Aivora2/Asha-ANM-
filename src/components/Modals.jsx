import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, ShieldAlert, CheckCircle, Clock, Heart, Calendar, Phone, Send, FileText } from 'lucide-react';

export const Modals = () => {
  const { activeModal, setActiveModal, modalData, triggerSosAlert, markVisitComplete, submitGrievance, showToast } = useApp();

  const [clinicalNoteText, setClinicalNoteText] = useState('');
  const [systolic, setSystolic] = useState('140');
  const [diastolic, setDiastolic] = useState('90');
  const [hbLevel, setHbLevel] = useState('8.5');

  const [sosLocation, setSosLocation] = useState('Sitapura Sector 3, Jaipur');
  const [sosIssue, setSosIssue] = useState('High BP & Dizziness in 3rd Trimester');

  const [apptPatientName, setApptPatientName] = useState('Pooja Sharma');
  const [apptPhone, setApptPhone] = useState('+91 98291 55443');
  const [apptDate, setApptDate] = useState('2026-10-09');

  const [grvName, setGrvName] = useState('');
  const [grvPhone, setGrvPhone] = useState('');
  const [grvCategory, setGrvCategory] = useState('Medicine Supply Shortage');
  const [grvLocation, setGrvLocation] = useState('Beelwa Sub-Center');
  const [grvDesc, setGrvDesc] = useState('');

  if (!activeModal) return null;

  const handleClose = () => setActiveModal(null);

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {/* 1. PRIORITY EXPLANATION MODAL ("Why this patient first?") */}
        {activeModal === 'priority-explanation' && modalData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#ffe4e6', color: '#e11d48', padding: 10, borderRadius: 10 }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2942' }}>
                  Priority Explanation
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Patient: <strong style={{ color: '#0f2942' }}>{modalData.name}</strong> ({modalData.age} yrs)
                </div>
              </div>
            </div>

            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9f1239' }}>RISK SCORE CALCULATED</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e11d48' }}>{modalData.riskScore} / 100</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#881337', marginTop: 4 }}>
                Status: <strong>{modalData.riskLevel} Priority Risk</strong>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#153a62', marginBottom: 8 }}>
              Why was this patient prioritized over others?
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, fontSize: '0.875rem', color: '#334155', marginBottom: 20 }}>
              {modalData.riskFactors ? modalData.riskFactors.map((rf, i) => (
                <li key={i} style={{ fontWeight: 600 }}>{rf}</li>
              )) : (
                <li>High risk medical indicators require urgent evaluation.</li>
              )}
            </ul>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} /> RECOMMENDED ACTION & WINDOW
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f2942', marginTop: 4 }}>
                {modalData.recommendedVisitWindow || 'Within 2 Hours'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
                {modalData.recommendedAction}
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleClose}>
              Acknowledge & Close
            </button>
          </div>
        )}

        {/* 2. EMERGENCY SOS MODAL */}
        {activeModal === 'emergency-sos' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#ffe4e6', color: '#e11d48', padding: 10, borderRadius: 10 }}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e11d48' }}>
                  🚨 Trigger Emergency SOS Alert
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Dispatches immediate alert to assigned ASHA, Supervisor & 108 Ambulance Desk
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Emergency Location Address:</label>
                <input 
                  type="text" 
                  value={sosLocation} 
                  onChange={e => setSosLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Medical Emergency Details / Symptoms:</label>
                <textarea 
                  rows={3} 
                  value={sosIssue} 
                  onChange={e => setSosIssue(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: 4 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn-emergency" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => triggerSosAlert({ location: sosLocation, issueType: sosIssue, priority: 'Critical' })}
              >
                <ShieldAlert size={18} /> CONFIRM EMERGENCY DISPATCH
              </button>
              <button className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 3. CLINICAL NOTE VISIT COMPLETION MODAL */}
        {activeModal === 'clinical-note' && modalData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#d1fae5', color: '#10b981', padding: 10, borderRadius: 10 }}>
                <CheckCircle size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2942' }}>
                  Complete Visit: {modalData.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Log Vitals & Observations for ASHA Clinical Record
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>BP Systolic</label>
                <input 
                  type="text" 
                  value={systolic} 
                  onChange={e => setSystolic(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>BP Diastolic</label>
                <input 
                  type="text" 
                  value={diastolic} 
                  onChange={e => setDiastolic(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Hb (g/dL)</label>
                <input 
                  type="text" 
                  value={hbLevel} 
                  onChange={e => setHbLevel(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Field Clinical Observations & Advice Given:</label>
              <textarea 
                rows={3} 
                placeholder="Enter notes e.g., Prescribed Iron Folic Acid tablets, advised bed rest, scheduled follow-up in 3 days."
                value={clinicalNoteText} 
                onChange={e => setClinicalNoteText(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: 4 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center', background: 'var(--emerald-success)' }}
                onClick={() => {
                  markVisitComplete(modalData.id, `BP: ${systolic}/${diastolic}, Hb: ${hbLevel}g/dL. Notes: ${clinicalNoteText || 'Patient stable.'}`);
                  handleClose();
                }}
              >
                <CheckCircle size={18} /> Save & Mark Completed
              </button>
              <button className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 4. OPD APPOINTMENT BOOKING MODAL */}
        {activeModal === 'appointment' && modalData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#e0f2fe', color: '#0284c7', padding: 10, borderRadius: 10 }}>
                <Calendar size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2942' }}>
                  Book Hospital OPD Slot
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {modalData.facility?.name} {modalData.doctor ? `(${modalData.doctor.name})` : ''}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Patient Full Name:</label>
                <input 
                  type="text" 
                  value={apptPatientName} 
                  onChange={e => setApptPatientName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Mobile Number:</label>
                <input 
                  type="text" 
                  value={apptPhone} 
                  onChange={e => setApptPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Preferred Appointment Date:</label>
                <input 
                  type="date" 
                  value={apptDate} 
                  onChange={e => setApptDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                showToast(`OPD Appointment booked for ${apptPatientName} on ${apptDate} at ${modalData.facility?.name}!`);
                handleClose();
              }}
            >
              Confirm Appointment Booking
            </button>
          </div>
        )}

        {/* 5. NOTIFICATION DETAIL MODAL */}
        {activeModal === 'notification-detail' && modalData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#fef3c7', color: '#f59e0b', padding: 10, borderRadius: 10 }}>
                <Heart size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2942' }}>
                  Healthcare Notification Details
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Published: {modalData.date}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#153a62', marginBottom: 10 }}>
              {modalData.title_en}
            </h4>
            <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.6, marginBottom: 20 }}>
              {modalData.details_en}
            </p>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleClose}>
              Close Notification
            </button>
          </div>
        )}

        {/* 6. GRIEVANCE SUBMISSION MODAL */}
        {activeModal === 'grievance-submit' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#e0f2fe', color: '#0284c7', padding: 10, borderRadius: 10 }}>
                <FileText size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2942' }}>
                  Submit Healthcare Grievance
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Official Grievance Redressal Mechanism for Citizens & Field Workers
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Full Name:</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={grvName} 
                  onChange={e => setGrvName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Mobile / Email:</label>
                <input 
                  type="text" 
                  placeholder="+91 98290 XXXXX" 
                  value={grvPhone} 
                  onChange={e => setGrvPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Grievance Category:</label>
                <select 
                  value={grvCategory} 
                  onChange={e => setGrvCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                >
                  <option value="Medicine Supply Shortage">Medicine Supply Shortage</option>
                  <option value="ASHA / ANM Visit Delay">ASHA / ANM Visit Delay</option>
                  <option value="Facility Infrastructure">Facility Infrastructure Issue</option>
                  <option value="Ambulance Delay">Ambulance Delay</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Location / Village:</label>
                <input 
                  type="text" 
                  value={grvLocation} 
                  onChange={e => setGrvLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Grievance Description:</label>
                <textarea 
                  rows={3} 
                  placeholder="Describe the problem in detail..." 
                  value={grvDesc} 
                  onChange={e => setGrvDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  if (!grvName || !grvDesc) {
                    showToast('Please fill in name and description');
                    return;
                  }
                  submitGrievance({ name: grvName, phone: grvPhone, category: grvCategory, location: grvLocation, description: grvDesc });
                }}
              >
                <Send size={16} /> Submit Grievance
              </button>
              <button className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
