import express from 'express';
import { db } from './db.js';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken,
  generateOtp,
  hashOtp,
  verifyOtp,
  sendSupervisorOtpSms
} from './auth.js';

export const authRouter = express.Router();

/**
 * POST /api/auth/supervisor/register
 * Registers a new supervisor after strict backend authorization & validation
 */
authRouter.post('/supervisor/register', (req, res) => {
  try {
    const {
      fullName,
      profilePhoto,
      mobileNumber,
      email,
      supervisorId,
      designation,
      department,
      assignedArea,
      facilityName,
      username,
      password,
      confirmPassword,
    } = req.body;

    // 1. Basic Presence Validation
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!mobileNumber || typeof mobileNumber !== 'string' || !mobileNumber.trim()) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }
    // Clean and validate mobile number format (at least 10 digits)
    const cleanedPhone = mobileNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!supervisorId || typeof supervisorId !== 'string' || !supervisorId.trim()) {
      return res.status(400).json({ error: 'Supervisor/Admin ID is required.' });
    }

    if (!designation || typeof designation !== 'string' || !designation.trim()) {
      return res.status(400).json({ error: 'Designation / Role is required.' });
    }

    if (!department || typeof department !== 'string' || !department.trim()) {
      return res.status(400).json({ error: 'Department / Organization is required.' });
    }

    if (!assignedArea || typeof assignedArea !== 'string' || !assignedArea.trim()) {
      return res.status(400).json({ error: 'Assigned Area / District / Block is required.' });
    }

    if (!facilityName || typeof facilityName !== 'string' || !facilityName.trim()) {
      return res.status(400).json({ error: 'Organization / Facility Name is required.' });
    }

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'Username is required.' });
    }
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const cleanSupervisorId = supervisorId.trim().toUpperCase();

    // 2. BACKEND SUPERVISOR ID AUTHORIZATION (Requirement #13)
    // Silently validate against the authorized IDs without leaking the list.
    const checkAuthorizedStmt = db.prepare('SELECT supervisor_id FROM authorized_supervisor_ids WHERE supervisor_id = ?');
    const isAuthorized = checkAuthorizedStmt.get(cleanSupervisorId);
    if (!isAuthorized) {
      return res.status(403).json({
        error: 'The Supervisor/Admin ID entered is not recognized or authorized in the official registry. Please verify your official credentials.',
      });
    }

    // 3. ONE-TIME SUPERVISOR ID REGISTRATION (Requirement #14)
    const checkUsedIdStmt = db.prepare('SELECT id FROM supervisors WHERE supervisor_id = ?');
    const alreadyRegisteredId = checkUsedIdStmt.get(cleanSupervisorId);
    if (alreadyRegisteredId) {
      return res.status(409).json({
        error: 'This Supervisor/Admin ID is already registered. Each authorized ID can only be associated with one account.',
      });
    }

    // 4. DUPLICATE ACCOUNT PROTECTION: Username & Email (Requirement #16)
    const checkUserStmt = db.prepare('SELECT id FROM supervisors WHERE username = ? COLLATE NOCASE');
    if (checkUserStmt.get(cleanUsername)) {
      return res.status(409).json({
        error: 'Username is already taken. Please choose another username.',
      });
    }

    const checkEmailStmt = db.prepare('SELECT id FROM supervisors WHERE email = ? COLLATE NOCASE');
    if (checkEmailStmt.get(email.trim())) {
      return res.status(409).json({
        error: 'Email address is already registered to another account.',
      });
    }

    // 5. SECURE PASSWORD HASHING (Requirement #17)
    const passwordHash = hashPassword(password);

    // 6. INSERT NEW SUPERVISOR
    const insertStmt = db.prepare(`
      INSERT INTO supervisors (
        supervisor_id,
        full_name,
        profile_photo,
        mobile_number,
        email,
        designation,
        department,
        assigned_area,
        facility_name,
        username,
        password_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      cleanSupervisorId,
      fullName.trim(),
      profilePhoto ? profilePhoto.trim() : null,
      mobileNumber.trim(),
      email.trim(),
      designation.trim(),
      department.trim(),
      assignedArea.trim(),
      facilityName.trim(),
      cleanUsername,
      passwordHash
    );

    // Fetch the inserted record for returning sanitized data
    const fetchNewStmt = db.prepare(`
      SELECT id, supervisor_id, full_name, profile_photo, mobile_number, email,
             designation, department, assigned_area, facility_name, username, created_at
      FROM supervisors WHERE supervisor_id = ?
    `);
    const newSupervisor = fetchNewStmt.get(cleanSupervisorId);

    return res.status(201).json({
      success: true,
      message: 'Supervisor account created successfully! You can now log in.',
      supervisor: {
        id: newSupervisor.id,
        supervisorId: newSupervisor.supervisor_id,
        fullName: newSupervisor.full_name,
        profilePhoto: newSupervisor.profile_photo,
        mobileNumber: newSupervisor.mobile_number,
        email: newSupervisor.email,
        designation: newSupervisor.designation,
        department: newSupervisor.department,
        assignedArea: newSupervisor.assigned_area,
        facilityName: newSupervisor.facility_name,
        username: newSupervisor.username,
        role: 'SUPERVISOR',
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during registration. Please try again.' });
  }
});

/**
 * POST /api/auth/supervisor/login
 * Step 1: Validates credentials, checks password hash, generates cryptographically secure OTP challenge
 */
authRouter.post('/supervisor/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Look up supervisor by username (case-insensitive)
    const findStmt = db.prepare(`
      SELECT id, supervisor_id, full_name, profile_photo, mobile_number, email,
             designation, department, assigned_area, facility_name, username, password_hash
      FROM supervisors
      WHERE username = ? COLLATE NOCASE
    `);

    const user = findStmt.get(username.trim());

    // Generic error message if user not found (Requirement #20)
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Verify password hash
    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // STEP 2: PHONE OTP VERIFICATION CHALLENGE (Requirement #8)
    // Rate limit check: max 5 active OTP requests in last 10 minutes
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const rateCheck = db.prepare(`
      SELECT COUNT(*) as count FROM supervisor_otps 
      WHERE supervisor_id = ? AND created_at > ?
    `).get(user.supervisor_id, tenMinsAgo);

    if (rateCheck.count >= 5) {
      return res.status(429).json({
        error: 'Too many verification attempts. Please wait 10 minutes before requesting another code.'
      });
    }

    // Invalidate any previous unexpired OTPs for this supervisor
    db.prepare('DELETE FROM supervisor_otps WHERE supervisor_id = ?').run(user.supervisor_id);

    // Generate cryptographically secure 6-digit OTP & temp token
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const tempToken = generateToken();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiry

    // Save hashed OTP (NEVER stored plaintext)
    db.prepare(`
      INSERT INTO supervisor_otps (supervisor_id, mobile_number, temp_token, otp_hash, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(user.supervisor_id, user.mobile_number, tempToken, otpHash, expiresAt);

    // Dispatch SMS via configured provider (Fast2SMS / Twilio) or dev simulator
    const smsResult = await sendSupervisorOtpSms({
      mobileNumber: user.mobile_number,
      otp,
      supervisorName: user.full_name
    });

    const cleanPhone = user.mobile_number.replace(/\D/g, '');
    const maskedMobile = `+91 ******${cleanPhone.slice(-4)}`;

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      tempToken,
      maskedMobile,
      expiresInSeconds: 300,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
      message: `Authentication code dispatched to registered mobile ${maskedMobile}.`
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during login. Please try again.' });
  }
});

/**
 * POST /api/auth/supervisor/verify-otp
 * Step 2: Validates OTP against stored hash, establishes 7-day session token
 */
authRouter.post('/supervisor/verify-otp', (req, res) => {
  try {
    const { tempToken, otp } = req.body;

    if (!tempToken || !otp) {
      return res.status(400).json({ error: 'Verification token and OTP are required.' });
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit verification code.' });
    }

    // Lookup active OTP record
    const otpRecord = db.prepare(`
      SELECT id, supervisor_id, mobile_number, otp_hash, attempts, expires_at
      FROM supervisor_otps WHERE temp_token = ?
    `).get(tempToken);

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired verification session. Please sign in again.' });
    }

    // Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      db.prepare('DELETE FROM supervisor_otps WHERE id = ?').run(otpRecord.id);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    // Check attempts limit (Max 3 failed attempts)
    if (otpRecord.attempts >= 3) {
      db.prepare('DELETE FROM supervisor_otps WHERE id = ?').run(otpRecord.id);
      return res.status(429).json({ error: 'Maximum verification attempts exceeded. Please sign in again.' });
    }

    // Verify OTP hash
    const isOtpValid = verifyOtp(cleanOtp, otpRecord.otp_hash);
    if (!isOtpValid) {
      const remaining = 2 - otpRecord.attempts;
      db.prepare('UPDATE supervisor_otps SET attempts = attempts + 1 WHERE id = ?').run(otpRecord.id);
      return res.status(401).json({
        error: remaining > 0 
          ? `Incorrect verification code. ${remaining} attempt(s) remaining.` 
          : 'Incorrect verification code. Maximum attempts reached. Please sign in again.'
      });
    }

    // Invalidate OTP immediately upon successful verification (Requirement #8)
    db.prepare('DELETE FROM supervisor_otps WHERE id = ?').run(otpRecord.id);

    // Fetch supervisor user details
    const user = db.prepare(`
      SELECT id, supervisor_id, full_name, profile_photo, mobile_number, email,
             designation, department, assigned_area, facility_name, username
      FROM supervisors WHERE supervisor_id = ?
    `).get(otpRecord.supervisor_id);

    if (!user) {
      return res.status(404).json({ error: 'Supervisor profile not found.' });
    }

    // Create 7-day authenticated session token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const insertSession = db.prepare('INSERT INTO supervisor_sessions (token, supervisor_id, expires_at) VALUES (?, ?, ?)');
    insertSession.run(token, user.supervisor_id, expiresAt);

    return res.status(200).json({
      success: true,
      token,
      supervisor: {
        id: user.id,
        supervisorId: user.supervisor_id,
        fullName: user.full_name,
        profilePhoto: user.profile_photo,
        mobileNumber: user.mobile_number,
        email: user.email,
        designation: user.designation,
        department: user.department,
        assignedArea: user.assigned_area,
        facilityName: user.facility_name,
        username: user.username,
        role: 'SUPERVISOR',
      },
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred during OTP verification.' });
  }
});

/**
 * POST /api/auth/supervisor/resend-otp
 */
authRouter.post('/supervisor/resend-otp', async (req, res) => {
  try {
    const { tempToken } = req.body;
    if (!tempToken) {
      return res.status(400).json({ error: 'Temporary token is required.' });
    }

    const otpRecord = db.prepare(`
      SELECT id, supervisor_id, mobile_number, resend_count, created_at
      FROM supervisor_otps WHERE temp_token = ?
    `).get(tempToken);

    if (!otpRecord) {
      return res.status(400).json({ error: 'Verification session expired. Please sign in again.' });
    }

    if (otpRecord.resend_count >= 3) {
      return res.status(429).json({ error: 'Maximum OTP resend requests reached. Please restart sign in.' });
    }

    const user = db.prepare('SELECT full_name FROM supervisors WHERE supervisor_id = ?').get(otpRecord.supervisor_id);

    // Generate new OTP
    const newOtp = generateOtp();
    const newOtpHash = hashOtp(newOtp);
    const newExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    db.prepare(`
      UPDATE supervisor_otps 
      SET otp_hash = ?, expires_at = ?, attempts = 0, resend_count = resend_count + 1
      WHERE id = ?
    `).run(newOtpHash, newExpiresAt, otpRecord.id);

    const smsResult = await sendSupervisorOtpSms({
      mobileNumber: otpRecord.mobile_number,
      otp: newOtp,
      supervisorName: user?.full_name
    });

    return res.status(200).json({
      success: true,
      devOtp: process.env.NODE_ENV !== 'production' ? newOtp : undefined,
      message: 'New verification code dispatched to your registered phone.'
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ error: 'Server error resending verification code.' });
  }
});

/**
 * GET /api/auth/supervisor/me
 * Returns current authenticated supervisor using bearer token
 */
authRouter.get('/supervisor/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const findSession = db.prepare('SELECT supervisor_id, expires_at FROM supervisor_sessions WHERE token = ?');
    const session = findSession.get(token);

    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Session expired or invalid.' });
    }

    const findSupervisor = db.prepare(`
      SELECT id, supervisor_id, full_name, profile_photo, mobile_number, email,
             designation, department, assigned_area, facility_name, username
      FROM supervisors WHERE supervisor_id = ?
    `);
    const user = findSupervisor.get(session.supervisor_id);

    if (!user) {
      return res.status(404).json({ error: 'Supervisor profile not found.' });
    }

    return res.json({
      supervisor: {
        id: user.id,
        supervisorId: user.supervisor_id,
        fullName: user.full_name,
        profilePhoto: user.profile_photo,
        mobileNumber: user.mobile_number,
        email: user.email,
        designation: user.designation,
        department: user.department,
        assignedArea: user.assigned_area,
        facilityName: user.facility_name,
        username: user.username,
        role: 'SUPERVISOR',
      },
    });
  } catch (err) {
    console.error('Session verify error:', err);
    return res.status(500).json({ error: 'Server error verifying session.' });
  }
});

/**
 * POST /api/auth/supervisor/logout
 */
authRouter.post('/supervisor/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const deleteSession = db.prepare('DELETE FROM supervisor_sessions WHERE token = ?');
      deleteSession.run(token);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Server error during logout.' });
  }
});
