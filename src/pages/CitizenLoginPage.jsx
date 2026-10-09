import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CitizenLoginPage = () => {
  const { setCurrentPage, handleLogin } = useApp();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email && !phone) {
      setError('Please enter your email or phone number.');
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234' || otp === '0000') {
      // Simulate demo registration check
      if (phone === '9999999999') {
        setError('No citizen record found for this number.');
      } else {
        handleLogin('CITIZEN_REGISTERED');
      }
    } else {
      setError('Invalid OTP. Please use demo OTP: 1234');
    }
  };

  return (
    <div className="citizen-login-page" style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/asha_worker_visit.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Light white-blue transparent overlay with soft blur */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(224, 242, 254, 0.45)', // Light white-blue transparent
        backdropFilter: 'blur(4px)'
      }} />

      <div className="login-card" style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        padding: '30px 30px 40px 30px',
        borderRadius: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        width: '100%',
        maxWidth: '420px',
        margin: '20px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Very thin Dark Blue and Yellow Strap at the very top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '12px',
          backgroundColor: '#0f2942',
          borderBottom: '3px solid #facc15',
        }} />
        
        <h2 style={{ color: '#0f2942', fontWeight: '800', marginBottom: '8px', fontSize: '1.75rem', marginTop: '10px' }}>Citizen Login</h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.95rem' }}>Access your health records and connect with your ASHA worker.</p>
        
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.875rem',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>OR</div>
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px', padding: '12px', fontSize: '1.05rem', backgroundColor: '#0284c7' }}>
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Enter OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Demo OTP: 1234"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '4px', outline: 'none' }}
                  maxLength={6}
                />
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>A demo OTP has been sent. Use 1234 to proceed.</div>
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px', padding: '12px', fontSize: '1.05rem', backgroundColor: '#eab308', color: '#0f2942' }}>
                Verify & Login
              </button>
              <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Back
              </button>
            </form>
          )}
      </div>
    </div>
  );
};
