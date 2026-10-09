import crypto from 'node:crypto';

/**
 * Hashes a plaintext password using crypto salt and scrypt
 * @param {string} password
 * @returns {string} salt:derivedKey
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verifies a password against the stored salt:derivedKey hash
 * @param {string} password
 * @param {string} storedHash
 * @returns {boolean}
 */
export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  const keyBuf = Buffer.from(key, 'hex');
  const derivedBuf = Buffer.from(derivedKey, 'hex');
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

/**
 * Generates a random session token
 * @returns {string}
 */
export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP
 * @returns {string}
 */
export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hashes a 6-digit OTP using scrypt
 * @param {string} otp
 * @returns {string}
 */
export function hashOtp(otp) {
  return hashPassword(otp);
}

/**
 * Verifies OTP against stored hash
 * @param {string} otp
 * @param {string} storedHash
 * @returns {boolean}
 */
export function verifyOtp(otp, storedHash) {
  return verifyPassword(otp, storedHash);
}

/**
 * Extensible SMS Provider Interface
 * Supports real SMS gateways (Fast2SMS, Twilio) via server env vars,
 * with explicit development fallback mode when unconfigured.
 */
export async function sendSupervisorOtpSms({ mobileNumber, otp, supervisorName }) {
  const isProd = process.env.NODE_ENV === 'production';
  const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);

  // 1. Production SMS Provider: Fast2SMS Integration (Indian Telecom Gateway)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: cleanMobile,
        })
      });
      const data = await response.json();
      if (data.return) {
        return { success: true, provider: 'fast2sms', message: 'SMS delivered via Fast2SMS.' };
      }
      console.error('[SMS PROVIDER ERROR] Fast2SMS rejected:', data);
    } catch (err) {
      console.error('[SMS PROVIDER ERROR] Fast2SMS dispatch failed:', err);
    }
  }

  // 2. Production SMS Provider: Twilio Integration
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const body = new URLSearchParams({
        To: `+91${cleanMobile}`,
        From: process.env.TWILIO_FROM_NUMBER,
        Body: `[EK ASHA] Verification Code: ${otp}. Valid for 5 minutes. Do not share with anyone.`
      });
      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.toString()
        }
      );
      if (twilioRes.ok) {
        return { success: true, provider: 'twilio', message: 'SMS delivered via Twilio.' };
      }
    } catch (err) {
      console.error('[SMS PROVIDER ERROR] Twilio dispatch failed:', err);
    }
  }

  // 3. Fallback: Development-only test mode (explicitly disabled in production)
  if (!isProd) {
    console.log(`\n========================================================================`);
    console.log(`[EK ASHA SMS SERVICE • DEV MODE]`);
    console.log(`Supervisor: ${supervisorName || 'Officer'}`);
    console.log(`Mobile: +91-${cleanMobile}`);
    console.log(`Verification Code (OTP): >>> ${otp} <<< (Expires in 5 minutes)`);
    console.log(`To enable live SMS delivery, set FAST2SMS_API_KEY or TWILIO credentials in .env`);
    console.log(`========================================================================\n`);

    return {
      success: true,
      provider: 'dev-simulator',
      devOtp: otp, // Passed strictly during development for UI testing
      message: 'Development Mode: Real SMS provider not configured. OTP printed to server terminal.'
    };
  }

  return {
    success: false,
    provider: 'none',
    error: 'SMS provider not configured on production server. Please contact administrator.'
  };
}
