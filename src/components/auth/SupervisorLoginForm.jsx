import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  RotateCw, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export const SupervisorLoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
  // Step: 'credentials' | 'otp'
  const [step, setStep] = useState('credentials');

  // Step 1: Credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: OTP
  const [tempToken, setTempToken] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(30);

  // General Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Countdown timer for OTP expiry
  useEffect(() => {
    let timer;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Resend cooldown timer
  useEffect(() => {
    let resendTimer;
    if (step === 'otp' && resendCooldown > 0) {
      resendTimer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(resendTimer);
  }, [step, resendCooldown]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  /* =========================================================================
     STEP 1: SUBMIT USERNAME & PASSWORD -> INITIATE OTP CHALLENGE
     ========================================================================= */
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/supervisor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error('Response JSON parse error:', parseErr);
        setErrorMessage('Server returned an invalid response format.');
        return;
      }

      if (!response.ok) {
        setErrorMessage(data?.error || 'Authentication failed. Please check your credentials.');
        return;
      }

      // Check if OTP challenge was issued
      if (data.requiresOtp && data.tempToken) {
        setTempToken(data.tempToken);
        setMaskedMobile(data.maskedMobile || 'Registered Mobile');
        setDevOtp(data.devOtp || '');
        setCountdown(data.expiresInSeconds || 300);
        setResendCooldown(30);
        setStep('otp');
        setSuccessNotice(data.message || 'Verification code dispatched to your registered mobile.');
      } else if (data.token && data.supervisor) {
        // Direct login fallback if OTP disabled
        onLoginSuccess(data.supervisor, data.token);
      }
    } catch (err) {
      console.error('Login network error:', err);
      setErrorMessage('Unable to connect to authentication server. Please ensure the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================================
     STEP 2: VERIFY PHONE OTP -> ESTABLISH SESSION
     ========================================================================= */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    const cleanOtp = otpValue.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    if (countdown <= 0) {
      setErrorMessage('The verification code has expired. Please request a new code.');
      return;
    }

    setLoading(true);
    let authResult = null;
    try {
      const response = await fetch('/api/auth/supervisor/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          otp: cleanOtp,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error('OTP response parse error:', parseErr);
        setErrorMessage('Server returned an invalid response format.');
        return;
      }

      if (!response.ok) {
        setErrorMessage(data?.error || 'Invalid verification code. Please check and try again.');
        return;
      }

      authResult = data;
    } catch (err) {
      console.error('OTP verify network error:', err);
      setErrorMessage('Unable to connect to verification server. Please check your connection.');
      return;
    } finally {
      setLoading(false);
    }

    if (authResult?.token && authResult?.supervisor) {
      onLoginSuccess(authResult.supervisor, authResult.token);
    }
  };

  /* =========================================================================
     RESEND OTP
     ========================================================================= */
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/supervisor/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data?.error || 'Failed to resend code.');
        return;
      }

      setCountdown(300);
      setResendCooldown(30);
      if (data.devOtp) setDevOtp(data.devOtp);
      setSuccessNotice('A fresh 6-digit verification code has been dispatched.');
    } catch (err) {
      setErrorMessage('Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fade-in">
      <h2 className="auth-form-title">
        {step === 'credentials' ? 'Supervisor / Admin Login' : 'Phone OTP Verification'}
      </h2>
      <p className="auth-form-subtitle">
        {step === 'credentials'
          ? 'Access administrative health supervision, beat allocations, and sector analytics.'
          : `Step 2: Enter the 6-digit verification code sent to ${maskedMobile}.`}
      </p>

      {errorMessage && (
        <div className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successNotice && (
        <div className="auth-alert auth-alert-success" role="status">
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{successNotice}</span>
        </div>
      )}

      {/* =====================================================================
          STEP 1 FORM: USERNAME & PASSWORD
          ===================================================================== */}
      {step === 'credentials' ? (
        <form onSubmit={handleCredentialsSubmit}>
          {/* Username */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="supervisor-username">
              Username <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <User size={18} />
              </span>
              <input
                id="supervisor-username"
                type="text"
                className="auth-input"
                placeholder="Enter official username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label className="auth-form-label" htmlFor="supervisor-password">
              Password <span className="required-dot">*</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <Lock size={18} />
              </span>
              <input
                id="supervisor-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Enter account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In as Supervisor &rarr;</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* ===================================================================
           STEP 2 FORM: 6-DIGIT PHONE OTP
           =================================================================== */
        <form onSubmit={handleOtpSubmit} className="auth-otp-form">
          {/* Development simulator banner for testing verification */}
          {devOtp && (
            <div style={{
              background: '#ecfdf5',
              border: '1.5px dashed #059669',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Dev Test Verification Code
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#047857', fontFamily: 'monospace', letterSpacing: '0.15em' }}>
                  {devOtp}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOtpValue(devOtp)}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* OTP Input */}
          <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="auth-form-label" htmlFor="supervisor-otp" style={{ margin: 0 }}>
                6-Digit Security Code <span className="required-dot">*</span>
              </label>
              <span style={{ fontSize: '0.8rem', color: countdown < 60 ? '#dc2626' : '#64748b', fontWeight: 600 }}>
                Expires: {formatTime(countdown)}
              </span>
            </div>

            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <KeyRound size={18} />
              </span>
              <input
                id="supervisor-otp"
                type="text"
                maxLength={6}
                className="auth-input"
                style={{
                  letterSpacing: '0.35em',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  fontFamily: 'monospace'
                }}
                placeholder="••••••"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Action Row */}
          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading || otpValue.length !== 6 || countdown <= 0}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Security Code...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Verify & Access Dashboard</span>
              </>
            )}
          </button>

          {/* Resend and Back Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button
              type="button"
              className="btn-auth-back"
              onClick={() => {
                setStep('credentials');
                setOtpValue('');
                setErrorMessage('');
                setSuccessNotice('');
              }}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={14} />
              <span>Back to Credentials</span>
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading || resendCooldown > 0}
              style={{
                background: 'transparent',
                border: 'none',
                color: resendCooldown > 0 ? '#94a3b8' : '#059669',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Switch to Registration */}
      {step === 'credentials' && (
        <div className="auth-switch-prompt">
          New Supervisor / Administrator?{' '}
          <button
            type="button"
            className="auth-switch-link"
            onClick={onSwitchToRegister}
          >
            Register Official Account &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
