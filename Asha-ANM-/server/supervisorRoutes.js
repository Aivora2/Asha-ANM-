import express from 'express';
import { db } from './db.js';

export const supervisorRouter = express.Router();

/**
 * Authentication Middleware for Supervisor Endpoints
 * Verifies Bearer session token against supervisor_sessions table
 */
export function requireSupervisorAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Authentication token is required.' });
    }

    const token = authHeader.split(' ')[1];
    const session = db.prepare(`
      SELECT supervisor_id, expires_at 
      FROM supervisor_sessions 
      WHERE token = ?
    `).get(token);

    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    }

    const supervisor = db.prepare(`
      SELECT id, supervisor_id, full_name, profile_photo, mobile_number, email,
             designation, department, assigned_area, facility_name, username
      FROM supervisors 
      WHERE supervisor_id = ?
    `).get(session.supervisor_id);

    if (!supervisor) {
      return res.status(404).json({ error: 'Supervisor account not found.' });
    }

    req.supervisor = supervisor;
    req.sessionToken = token;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Server authentication error.' });
  }
}

// Apply auth middleware to all supervisor routes
supervisorRouter.use(requireSupervisorAuth);

/* ==========================================================================
   1. SUPERVISOR PROFILE (VIEW & EDIT)
   ========================================================================== */

/**
 * GET /api/supervisor/profile
 */
supervisorRouter.get('/profile', (req, res) => {
  return res.json({ success: true, supervisor: req.supervisor });
});

/**
 * PUT /api/supervisor/profile
 * Allows editing details while keeping Supervisor ID strictly immutable
 */
supervisorRouter.put('/profile', (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      designation,
      department,
      assignedArea,
      facilityName,
      profilePhoto
    } = req.body;

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    const cleanPhone = (mobileNumber || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number is required.' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    // Check duplicate email (if changed to an existing email belonging to someone else)
    const emailCheck = db.prepare(`
      SELECT id FROM supervisors 
      WHERE email = ? COLLATE NOCASE AND supervisor_id != ?
    `).get(email.trim(), req.supervisor.supervisor_id);

    if (emailCheck) {
      return res.status(409).json({ error: 'Email address is already in use by another account.' });
    }

    // Update supervisor record (Notice supervisor_id is NEVER updated!)
    db.prepare(`
      UPDATE supervisors
      SET full_name = ?,
          mobile_number = ?,
          email = ?,
          designation = ?,
          department = ?,
          assigned_area = ?,
          facility_name = ?,
          profile_photo = ?
      WHERE supervisor_id = ?
    `).run(
      fullName.trim(),
      mobileNumber.trim(),
      email.trim(),
      (designation || req.supervisor.designation).trim(),
      (department || req.supervisor.department).trim(),
      (assignedArea || req.supervisor.assigned_area).trim(),
      (facilityName || req.supervisor.facility_name).trim(),
      profilePhoto !== undefined ? profilePhoto : req.supervisor.profile_photo,
      req.supervisor.supervisor_id
    );

    const updated = db.prepare(`
      SELECT id, supervisor_id, full_name, profile_photo, mobile_number, email,
             designation, department, assigned_area, facility_name, username
      FROM supervisors WHERE supervisor_id = ?
    `).get(req.supervisor.supervisor_id);

    return res.json({
      success: true,
      message: 'Supervisor profile updated successfully.',
      supervisor: {
        id: updated.id,
        supervisorId: updated.supervisor_id,
        fullName: updated.full_name,
        profilePhoto: updated.profile_photo,
        mobileNumber: updated.mobile_number,
        email: updated.email,
        designation: updated.designation,
        department: updated.department,
        assignedArea: updated.assigned_area,
        facilityName: updated.facility_name,
        username: updated.username,
        role: 'SUPERVISOR'
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Server error updating supervisor profile.' });
  }
});

/* ==========================================================================
   2. ASHA & ANM WORKER MANAGEMENT (ADD & DIRECTORY LIST)
   ========================================================================== */

/**
 * GET /api/supervisor/workers
 * Returns active and registered ASHA/ANM workers with real metrics
 */
supervisorRouter.get('/workers', (req, res) => {
  try {
    const workers = db.prepare(`
      SELECT 
        w.id,
        w.worker_id,
        w.full_name,
        w.profile_photo,
        w.gender,
        w.dob,
        w.mobile_number,
        w.email,
        w.designation,
        w.district,
        w.block,
        w.facility_name,
        w.beat_area,
        w.joining_date,
        w.status,
        w.username,
        w.created_by_supervisor_id,
        w.created_at,
        w.updated_at
      FROM asha_workers w
      ORDER BY w.created_at DESC
    `).all();

    // Enrich workers with actual database visit & patient assignment metrics
    const enriched = workers.map(w => {
      const patientCount = db.prepare(`
        SELECT COUNT(*) as count 
        FROM patient_assignments 
        WHERE assigned_worker_id = ?
      `).get(w.worker_id).count;

      const visitStats = db.prepare(`
        SELECT 
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed
        FROM worker_visits
        WHERE worker_id = ?
      `).get(w.worker_id);

      const completed = visitStats.completed || 0;
      const pending = visitStats.pending || 0;
      const missed = visitStats.missed || 0;
      const totalDue = completed + missed;
      const completionRate = totalDue > 0 ? Math.round((completed / totalDue) * 100) : (completed > 0 ? 100 : null);

      return {
        ...w,
        assignedPatientsCount: patientCount,
        completedVisits: completed,
        pendingVisits: pending,
        missedVisits: missed,
        completionRate: completionRate !== null ? `${completionRate}%` : 'N/A',
        workload: patientCount + pending
      };
    });

    return res.json({ success: true, count: enriched.length, workers: enriched });
  } catch (err) {
    console.error('Fetch workers error:', err);
    return res.status(500).json({ error: 'Server error retrieving workers directory.' });
  }
});

/**
 * POST /api/supervisor/workers
 * Adds new ASHA/ANM worker, generates unique worker_id and username
 */
supervisorRouter.post('/workers', (req, res) => {
  try {
    const {
      fullName,
      profilePhoto,
      gender,
      dob,
      mobileNumber,
      email,
      designation,
      district,
      block,
      facilityName,
      beatArea,
      joiningDate,
      status,
      customWorkerId
    } = req.body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ error: 'Worker full name is required.' });
    }

    const cleanPhone = (mobileNumber || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!designation || !['ASHA', 'ANM'].includes(designation.toUpperCase())) {
      return res.status(400).json({ error: 'Designation must be either ASHA or ANM.' });
    }
    const cleanDesignation = designation.toUpperCase();

    if (!district || !district.trim()) {
      return res.status(400).json({ error: 'Assigned district is required.' });
    }

    if (!block || !block.trim()) {
      return res.status(400).json({ error: 'Assigned block is required.' });
    }

    if (!facilityName || !facilityName.trim()) {
      return res.status(400).json({ error: 'Health facility name is required.' });
    }

    if (!beatArea || !beatArea.trim()) {
      return res.status(400).json({ error: 'Village / Beat Area is required.' });
    }

    // Generate unique Worker ID if not provided
    let workerId = customWorkerId ? customWorkerId.trim().toUpperCase() : null;
    if (!workerId) {
      let candidateId;
      let isUnique = false;
      while (!isUnique) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        candidateId = `${cleanDesignation}-JPR-${randNum}`;
        const existing = db.prepare('SELECT id FROM asha_workers WHERE worker_id = ?').get(candidateId);
        if (!existing) isUnique = true;
      }
      workerId = candidateId;
    } else {
      const existing = db.prepare('SELECT id FROM asha_workers WHERE worker_id = ?').get(workerId);
      if (existing) {
        return res.status(409).json({ error: `Worker ID "${workerId}" is already assigned to another record.` });
      }
    }

    // Auto-generate Unique Username (Requirement #2)
    // Format: <role>.<firstname>.<random3digits> e.g. asha.sunita.402
    const firstName = fullName.trim().toLowerCase().split(/\s+/)[0].replace(/[^a-z]/g, '') || 'worker';
    let generatedUsername;
    let usernameUnique = false;
    while (!usernameUnique) {
      const suffix = Math.floor(100 + Math.random() * 900);
      generatedUsername = `${cleanDesignation.toLowerCase()}.${firstName}.${suffix}`;
      const existing = db.prepare('SELECT id FROM asha_workers WHERE username = ? COLLATE NOCASE').get(generatedUsername);
      if (!existing) usernameUnique = true;
    }

    // Insert into database
    const insertStmt = db.prepare(`
      INSERT INTO asha_workers (
        worker_id, full_name, profile_photo, gender, dob, mobile_number, email,
        designation, district, block, facility_name, beat_area, joining_date,
        status, username, created_by_supervisor_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      workerId,
      fullName.trim(),
      profilePhoto ? profilePhoto.trim() : null,
      gender || 'Female',
      dob || '1990-01-01',
      cleanPhone.slice(-10),
      email ? email.trim() : null,
      cleanDesignation,
      district.trim(),
      block.trim(),
      facilityName.trim(),
      beatArea.trim(),
      joiningDate || new Date().toISOString().split('T')[0],
      status || 'Active',
      generatedUsername,
      req.supervisor.supervisor_id
    );

    const created = db.prepare('SELECT * FROM asha_workers WHERE worker_id = ?').get(workerId);

    return res.status(201).json({
      success: true,
      message: `${cleanDesignation} worker ${fullName} onboarded successfully!`,
      generatedUsername,
      workerId,
      worker: {
        ...created,
        assignedPatientsCount: 0,
        completedVisits: 0,
        pendingVisits: 0,
        missedVisits: 0,
        completionRate: 'N/A',
        workload: 0
      }
    });
  } catch (err) {
    console.error('Add worker error:', err);
    return res.status(500).json({ error: 'Server error registering worker.' });
  }
});

/**
 * PUT /api/supervisor/workers/:id
 * Updates worker details
 */
supervisorRouter.put('/workers/:id', (req, res) => {
  try {
    const workerDbId = req.params.id;
    const {
      fullName,
      mobileNumber,
      email,
      designation,
      district,
      block,
      facilityName,
      beatArea,
      status,
      profilePhoto
    } = req.body;

    const existing = db.prepare('SELECT * FROM asha_workers WHERE id = ?').get(workerDbId);
    if (!existing) {
      return res.status(404).json({ error: 'Worker record not found.' });
    }

    const cleanPhone = (mobileNumber || existing.mobile_number).replace(/\D/g, '');

    db.prepare(`
      UPDATE asha_workers
      SET full_name = ?,
          mobile_number = ?,
          email = ?,
          designation = ?,
          district = ?,
          block = ?,
          facility_name = ?,
          beat_area = ?,
          status = ?,
          profile_photo = COALESCE(?, profile_photo),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      (fullName || existing.full_name).trim(),
      cleanPhone.slice(-10),
      email !== undefined ? email : existing.email,
      (designation || existing.designation).toUpperCase(),
      (district || existing.district).trim(),
      (block || existing.block).trim(),
      (facilityName || existing.facility_name).trim(),
      (beatArea || existing.beat_area).trim(),
      status || existing.status,
      profilePhoto || null,
      workerDbId
    );

    const updated = db.prepare('SELECT * FROM asha_workers WHERE id = ?').get(workerDbId);
    return res.json({ success: true, message: 'Worker record updated successfully.', worker: updated });
  } catch (err) {
    console.error('Update worker error:', err);
    return res.status(500).json({ error: 'Server error updating worker record.' });
  }
});

/**
 * PATCH /api/supervisor/workers/:id/status
 * Activates / deactivates worker with confirmation
 */
supervisorRouter.patch('/workers/:id/status', (req, res) => {
  try {
    const workerDbId = req.params.id;
    const { status } = req.body;

    if (!status || !['Active', 'Inactive', 'On Leave'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Active, Inactive, or On Leave.' });
    }

    const existing = db.prepare('SELECT id, full_name, worker_id FROM asha_workers WHERE id = ?').get(workerDbId);
    if (!existing) {
      return res.status(404).json({ error: 'Worker record not found.' });
    }

    db.prepare(`
      UPDATE asha_workers 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(status, workerDbId);

    return res.json({
      success: true,
      message: `Worker ${existing.full_name} status updated to ${status}.`,
      status
    });
  } catch (err) {
    console.error('Toggle status error:', err);
    return res.status(500).json({ error: 'Server error updating worker status.' });
  }
});

/* ==========================================================================
   3. AREA-WISE WORKER ASSIGNMENT & JURISDICTIONS
   ========================================================================== */

/**
 * GET /api/supervisor/areas
 * Returns aggregated areas, coverage, assigned workers and patient count
 */
supervisorRouter.get('/areas', (req, res) => {
  try {
    // Unique beat clusters from workers and patient records
    const beatsRaw = db.prepare(`
      SELECT DISTINCT beat_area as beat, district, block, facility_name as facility
      FROM asha_workers
      UNION
      SELECT DISTINCT village_beat as beat, district, block, facility_name as facility
      FROM patient_assignments
    `).all();

    const areaList = beatsRaw.map(area => {
      // Find workers assigned to this beat
      const workers = db.prepare(`
        SELECT worker_id, full_name, designation, status, mobile_number
        FROM asha_workers
        WHERE beat_area = ?
      `).all(area.beat);

      // Count patient families in this beat
      const patients = db.prepare(`
        SELECT COUNT(*) as count 
        FROM patient_assignments 
        WHERE village_beat = ?
      `).get(area.beat).count;

      return {
        beat: area.beat,
        district: area.district,
        block: area.block,
        facility: area.facility,
        assignedWorkers: workers,
        assignedWorkersCount: workers.length,
        patientsCount: patients,
        isUnassigned: workers.length === 0
      };
    });

    return res.json({ success: true, areas: areaList });
  } catch (err) {
    console.error('Fetch areas error:', err);
    return res.status(500).json({ error: 'Server error fetching areas summary.' });
  }
});

/**
 * PUT /api/supervisor/workers/:id/area
 * Updates worker's assigned area / beat
 */
supervisorRouter.put('/workers/:id/area', (req, res) => {
  try {
    const workerDbId = req.params.id;
    const { district, block, facilityName, beatArea } = req.body;

    if (!beatArea || !beatArea.trim()) {
      return res.status(400).json({ error: 'Beat area is required.' });
    }

    const worker = db.prepare('SELECT worker_id, full_name FROM asha_workers WHERE id = ?').get(workerDbId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found.' });
    }

    db.prepare(`
      UPDATE asha_workers
      SET district = COALESCE(?, district),
          block = COALESCE(?, block),
          facility_name = COALESCE(?, facility_name),
          beat_area = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      district ? district.trim() : null,
      block ? block.trim() : null,
      facilityName ? facilityName.trim() : null,
      beatArea.trim(),
      workerDbId
    );

    return res.json({
      success: true,
      message: `Assigned area for ${worker.full_name} updated to "${beatArea.trim()}".`
    });
  } catch (err) {
    console.error('Update worker area error:', err);
    return res.status(500).json({ error: 'Server error updating worker area assignment.' });
  }
});

/* ==========================================================================
   4. WORKER PERFORMANCE & MISSED VISITS REASSIGNMENT
   ========================================================================== */

/**
 * GET /api/supervisor/performance
 * Calculates factual visit performance metrics from worker_visits and patient_assignments
 */
supervisorRouter.get('/performance', (req, res) => {
  try {
    const aggregate = db.prepare(`
      SELECT 
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as totalCompleted,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as totalPending,
        SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as totalMissed,
        COUNT(*) as totalVisits
      FROM worker_visits
    `).get();

    const totalCompleted = aggregate.totalCompleted || 0;
    const totalPending = aggregate.totalPending || 0;
    const totalMissed = aggregate.totalMissed || 0;
    const totalDue = totalCompleted + totalMissed;
    const overallCompletionRate = totalDue > 0 ? Math.round((totalCompleted / totalDue) * 100) : (totalCompleted > 0 ? 100 : 0);

    const totalPatients = db.prepare('SELECT COUNT(*) as count FROM patient_assignments').get().count;

    // Worker breakdown
    const workers = db.prepare(`
      SELECT id, worker_id, full_name, designation, beat_area, status
      FROM asha_workers
      ORDER BY full_name ASC
    `).all();

    const workerMetrics = workers.map(w => {
      const stats = db.prepare(`
        SELECT 
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed
        FROM worker_visits
        WHERE worker_id = ?
      `).get(w.worker_id);

      const patientCount = db.prepare(`
        SELECT COUNT(*) as count FROM patient_assignments WHERE assigned_worker_id = ?
      `).get(w.worker_id).count;

      const comp = stats.completed || 0;
      const pend = stats.pending || 0;
      const miss = stats.missed || 0;
      const due = comp + miss;
      const rate = due > 0 ? Math.round((comp / due) * 100) : (comp > 0 ? 100 : null);

      return {
        ...w,
        assignedPatients: patientCount,
        completedVisits: comp,
        pendingVisits: pend,
        missedVisits: miss,
        completionRate: rate !== null ? `${rate}%` : 'N/A',
        completionRateNum: rate !== null ? rate : 0,
        workload: patientCount + pend
      };
    });

    return res.json({
      success: true,
      summary: {
        totalCompleted,
        totalPending,
        totalMissed,
        totalWorkload: totalPatients + totalPending,
        overallCompletionRate: `${overallCompletionRate}%`,
        overallCompletionRateNum: overallCompletionRate,
        totalPatients
      },
      workerMetrics
    });
  } catch (err) {
    console.error('Performance calculation error:', err);
    return res.status(500).json({ error: 'Server error computing performance metrics.' });
  }
});

/**
 * GET /api/supervisor/visits/missed
 * Returns list of scheduled visits recorded as missed for reassignment
 */
supervisorRouter.get('/visits/missed', (req, res) => {
  try {
    const missedVisits = db.prepare(`
      SELECT 
        v.id,
        v.visit_id,
        v.patient_id,
        v.patient_name,
        v.worker_id,
        w.full_name as worker_name,
        w.designation as worker_designation,
        w.beat_area as worker_beat,
        v.visit_type,
        v.scheduled_date,
        v.missed_reason,
        v.reassigned_from_worker_id,
        v.reassigned_at
      FROM worker_visits v
      LEFT JOIN asha_workers w ON v.worker_id = w.worker_id
      WHERE v.status = 'missed'
      ORDER BY v.scheduled_date DESC
    `).all();

    return res.json({ success: true, count: missedVisits.length, missedVisits });
  } catch (err) {
    console.error('Fetch missed visits error:', err);
    return res.status(500).json({ error: 'Server error fetching missed visits.' });
  }
});

/**
 * POST /api/supervisor/visits/:id/reassign
 * Reassigns a missed visit to an eligible worker and updates state to pending
 */
supervisorRouter.post('/visits/:id/reassign', (req, res) => {
  try {
    const visitDbId = req.params.id;
    const { reassignToWorkerId, notes } = req.body;

    if (!reassignToWorkerId) {
      return res.status(400).json({ error: 'Destination worker ID is required for reassignment.' });
    }

    const visit = db.prepare('SELECT * FROM worker_visits WHERE id = ?').get(visitDbId);
    if (!visit) {
      return res.status(404).json({ error: 'Visit record not found.' });
    }

    if (visit.status !== 'missed') {
      return res.status(400).json({ error: 'Only missed visits can be reassigned.' });
    }

    const destWorker = db.prepare(`
      SELECT worker_id, full_name, status 
      FROM asha_workers 
      WHERE worker_id = ?
    `).get(reassignToWorkerId);

    if (!destWorker) {
      return res.status(404).json({ error: 'Selected destination worker does not exist.' });
    }

    if (destWorker.status !== 'Active') {
      return res.status(400).json({ error: `Worker ${destWorker.full_name} is currently ${destWorker.status} and cannot take reassigned visits.` });
    }

    // Persist reassignment in SQLite
    db.prepare(`
      UPDATE worker_visits
      SET worker_id = ?,
          reassigned_from_worker_id = ?,
          reassigned_at = CURRENT_TIMESTAMP,
          status = 'pending',
          reassignment_note = ?
      WHERE id = ?
    `).run(
      destWorker.worker_id,
      visit.worker_id,
      notes || `Reassigned by Supervisor ${req.supervisor.full_name}`,
      visitDbId
    );

    return res.json({
      success: true,
      message: `Missed visit for ${visit.patient_name} successfully reassigned to ${destWorker.full_name}.`,
      visitId: visit.visit_id
    });
  } catch (err) {
    console.error('Reassign visit error:', err);
    return res.status(500).json({ error: 'Server error reassigning visit.' });
  }
});

/* ==========================================================================
   5. WORKER REDISTRIBUTION (PATIENT / FAMILY CASELOAD TRANSFER)
   ========================================================================== */

/**
 * GET /api/supervisor/patients
 * Returns patient records, optionally filtered by assigned worker
 */
supervisorRouter.get('/patients', (req, res) => {
  try {
    const { workerId, unassignedOnly } = req.query;

    let query = `
      SELECT 
        p.id,
        p.patient_id,
        p.patient_name,
        p.family_head,
        p.phone,
        p.district,
        p.block,
        p.facility_name,
        p.village_beat,
        p.condition_summary,
        p.risk_level,
        p.assigned_worker_id,
        w.full_name as assigned_worker_name,
        w.designation as assigned_worker_designation
      FROM patient_assignments p
      LEFT JOIN asha_workers w ON p.assigned_worker_id = w.worker_id
    `;

    const params = [];
    if (workerId) {
      query += ` WHERE p.assigned_worker_id = ?`;
      params.push(workerId);
    } else if (unassignedOnly === 'true') {
      query += ` WHERE p.assigned_worker_id IS NULL`;
    }

    query += ` ORDER BY p.patient_name ASC`;

    const patients = db.prepare(query).all(...params);
    return res.json({ success: true, count: patients.length, patients });
  } catch (err) {
    console.error('Fetch patients error:', err);
    return res.status(500).json({ error: 'Server error fetching patient records.' });
  }
});

/**
 * POST /api/supervisor/redistribute
 * Reallocates selected patient/family records from source worker to destination worker
 */
supervisorRouter.post('/redistribute', (req, res) => {
  try {
    const { sourceWorkerId, destinationWorkerId, patientIds, reason } = req.body;

    if (!sourceWorkerId || !destinationWorkerId) {
      return res.status(400).json({ error: 'Source and destination workers are both required.' });
    }

    if (sourceWorkerId === destinationWorkerId) {
      return res.status(400).json({ error: 'Source and destination workers must be different.' });
    }

    if (!Array.isArray(patientIds) || patientIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one patient record to transfer.' });
    }

    const sourceWorker = db.prepare('SELECT worker_id, full_name FROM asha_workers WHERE worker_id = ?').get(sourceWorkerId);
    const destWorker = db.prepare('SELECT worker_id, full_name, status FROM asha_workers WHERE worker_id = ?').get(destinationWorkerId);

    if (!sourceWorker || !destWorker) {
      return res.status(404).json({ error: 'One or both workers could not be found.' });
    }

    if (destWorker.status !== 'Active') {
      return res.status(400).json({ error: `Destination worker ${destWorker.full_name} is ${destWorker.status} and cannot accept transfers.` });
    }

    // Verify patients are currently assigned to source worker
    const updatePatientStmt = db.prepare(`
      UPDATE patient_assignments 
      SET assigned_worker_id = ?, assigned_at = CURRENT_TIMESTAMP 
      WHERE patient_id = ? AND assigned_worker_id = ?
    `);

    const updatePendingVisitsStmt = db.prepare(`
      UPDATE worker_visits 
      SET worker_id = ?, 
          reassigned_from_worker_id = ?, 
          reassigned_at = CURRENT_TIMESTAMP,
          reassignment_note = ?
      WHERE patient_id = ? AND worker_id = ? AND status = 'pending'
    `);

    let transferredCount = 0;
    for (const patId of patientIds) {
      const result = updatePatientStmt.run(destWorker.worker_id, patId, sourceWorker.worker_id);
      if (result.changes > 0) {
        transferredCount++;
        // Also move any open pending visits for this patient
        updatePendingVisitsStmt.run(
          destWorker.worker_id,
          sourceWorker.worker_id,
          `Redistributed by supervisor: ${reason || 'Caseload rebalancing'}`,
          patId,
          sourceWorker.worker_id
        );
      }
    }

    return res.json({
      success: true,
      transferredCount,
      message: `Successfully transferred ${transferredCount} patient family caseloads from ${sourceWorker.full_name} to ${destWorker.full_name}.`,
      sourceWorker: sourceWorker.full_name,
      destinationWorker: destWorker.full_name
    });
  } catch (err) {
    console.error('Redistribution error:', err);
    return res.status(500).json({ error: 'Server error during worker redistribution.' });
  }
});
