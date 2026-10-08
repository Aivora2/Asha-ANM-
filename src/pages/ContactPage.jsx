import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Send, HelpCircle, ShieldCheck } from 'lucide-react';

export const ContactPage = () => {
  const { showToast } = useApp();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactMsg) {
      showToast('Please fill in your name and message');
      return;
    }
    showToast('Thank you! Your message has been sent to the EK ASHA Helpdesk.');
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy-deep)' }}>
          Contact & Helpdesk
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: 8 }}>
          Need assistance or technical support regarding EK ASHA field operations? Reach out to our public health support team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ borderLeft: '4px solid var(--blue-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ background: '#e0f2fe', padding: 10, borderRadius: 10, color: '#0284c7' }}>
                <Phone size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>NATIONAL HELPLINES</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f2942' }}>108 / 104 (24x7 Toll Free)</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Direct medical emergency hotline & ASHA worker telephone consultation desk.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--teal-brand)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ background: '#ccfbf1', padding: 10, borderRadius: 10, color: '#0d9488' }}>
                <Mail size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>EMAIL SUPPORT</div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f2942' }}>support@ekasha.gov.in</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Technical queries, supervisor account creation, and field device support.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--navy-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ background: '#e2e8f0', padding: 10, borderRadius: 10, color: '#153a62' }}>
                <MapPin size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>PROJECT OFFICE</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f2942' }}>National Health Mission Hub</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              RIICO Institutional Area, Sitapura, Jaipur, Rajasthan 302022
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ background: '#f8fafc' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2942', marginBottom: 16 }}>
            Send Us a Message
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Your Name:</label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                value={contactName} 
                onChange={e => setContactName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Email / Mobile:</label>
              <input 
                type="text" 
                placeholder="Enter email or mobile" 
                value={contactEmail} 
                onChange={e => setContactEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Message / Inquiry:</label>
              <textarea 
                rows={4} 
                placeholder="Write your query here..." 
                value={contactMsg} 
                onChange={e => setContactMsg(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
              <Send size={16} /> Send Inquiry
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
