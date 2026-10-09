import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'supervisor.db');
export const db = new DatabaseSync(dbPath);

// Initialize schema
export function initDatabase() {
  // 1. Authorized Supervisor IDs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS authorized_supervisor_ids (
      supervisor_id TEXT PRIMARY KEY NOT NULL
    );
  `);

  // Seed authorized supervisor IDs (Requirement #13)
  const authorizedIds = [
    'SUPJPR0247',
    'SUPJPR0248',
    'SUPJPR0249',
    'SUPJPR0250',
    'SUPJPR0251',
    'SUPJPR0252',
    'SUPJPR0253',
    'SUPJPR0254',
  ];

  const checkIdStmt = db.prepare('SELECT supervisor_id FROM authorized_supervisor_ids WHERE supervisor_id = ?');
  const insertIdStmt = db.prepare('INSERT INTO authorized_supervisor_ids (supervisor_id) VALUES (?)');

  for (const id of authorizedIds) {
    const existing = checkIdStmt.get(id);
    if (!existing) {
      insertIdStmt.run(id);
    }
  }

  // 2. Registered Supervisors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS supervisors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supervisor_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      profile_photo TEXT,
      mobile_number TEXT NOT NULL,
      email TEXT UNIQUE COLLATE NOCASE NOT NULL,
      designation TEXT NOT NULL,
      department TEXT NOT NULL,
      assigned_area TEXT NOT NULL,
      facility_name TEXT NOT NULL,
      username TEXT UNIQUE COLLATE NOCASE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supervisor_id) REFERENCES authorized_supervisor_ids (supervisor_id)
    );
  `);

  // 3. Supervisor Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS supervisor_sessions (
      token TEXT PRIMARY KEY,
      supervisor_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    );
  `);

  // 4. Supervisor OTP table for 2-step phone verification (Requirement #8)
  db.exec(`
    CREATE TABLE IF NOT EXISTS supervisor_otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supervisor_id TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      temp_token TEXT UNIQUE NOT NULL,
      otp_hash TEXT NOT NULL,
      attempts INTEGER DEFAULT 0,
      resend_count INTEGER DEFAULT 0,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. ASHA & ANM Workers Registry (Requirement #2 & #3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS asha_workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      profile_photo TEXT,
      gender TEXT NOT NULL,
      dob TEXT,
      mobile_number TEXT NOT NULL,
      email TEXT,
      designation TEXT NOT NULL,
      district TEXT NOT NULL,
      block TEXT NOT NULL,
      facility_name TEXT NOT NULL,
      beat_area TEXT NOT NULL,
      joining_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      username TEXT UNIQUE COLLATE NOCASE NOT NULL,
      created_by_supervisor_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Patient / Family Beat Assignments (Requirement #4 & #6)
  db.exec(`
    CREATE TABLE IF NOT EXISTS patient_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT UNIQUE NOT NULL,
      patient_name TEXT NOT NULL,
      family_head TEXT NOT NULL,
      phone TEXT,
      district TEXT NOT NULL,
      block TEXT NOT NULL,
      facility_name TEXT NOT NULL,
      village_beat TEXT NOT NULL,
      condition_summary TEXT,
      risk_level TEXT DEFAULT 'Medium',
      assigned_worker_id TEXT,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_worker_id) REFERENCES asha_workers (worker_id)
    );
  `);

  // 7. Worker Scheduled Visits & Performance Records (Requirement #5)
  db.exec(`
    CREATE TABLE IF NOT EXISTS worker_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visit_id TEXT UNIQUE NOT NULL,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      visit_type TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      completed_date TEXT,
      missed_reason TEXT,
      reassigned_from_worker_id TEXT,
      reassigned_at DATETIME,
      reassignment_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (worker_id) REFERENCES asha_workers (worker_id)
    );
  `);

  // Seed baseline active ASHA & ANM workers if empty
  const workerCount = db.prepare('SELECT COUNT(*) as count FROM asha_workers').get();
  if (workerCount.count === 0) {
    const insertWorker = db.prepare(`
      INSERT INTO asha_workers (
        worker_id, full_name, profile_photo, gender, dob, mobile_number, email,
        designation, district, block, facility_name, beat_area, joining_date,
        status, username, created_by_supervisor_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertWorker.run(
      'ASHA-JPR-1001',
      'Sunita Devi',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      'Female',
      '1988-04-12',
      '9829012345',
      'sunita.devi@asha.health.gov.in',
      'ASHA',
      'Jaipur',
      'Sitapura',
      'PHC Beelwa',
      'Sitapura Beat 3 & Beelwa Village',
      '2021-03-15',
      'Active',
      'asha.sunita.1001',
      'SUPJPR0248'
    );

    insertWorker.run(
      'ANM-JPR-1002',
      'Anita Sharma',
      'https://images.unsplash.com/photo-1594824813566-82823df577b0?auto=format&fit=crop&q=80&w=300',
      'Female',
      '1985-09-24',
      '9829067890',
      'anita.sharma@health.gov.in',
      'ANM',
      'Jaipur',
      'Sanganer',
      'CHC Sanganer',
      'Pratap Nagar & Sanganer West',
      '2018-07-01',
      'Active',
      'anm.anita.1002',
      'SUPJPR0248'
    );
  }

  // Seed baseline patient assignments if empty
  const patientCount = db.prepare('SELECT COUNT(*) as count FROM patient_assignments').get();
  if (patientCount.count === 0) {
    const insertPatient = db.prepare(`
      INSERT INTO patient_assignments (
        patient_id, patient_name, family_head, phone, district, block,
        facility_name, village_beat, condition_summary, risk_level, assigned_worker_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPatient.run('p-101', 'Meena Devi', 'Rameshwar Lal', '9829155401', 'Jaipur', 'Sitapura', 'PHC Beelwa', 'Sitapura Beat 3 & Beelwa Village', 'Pregnancy 34 Wk - Severe Anemia & High BP', 'Critical', 'ASHA-JPR-1001');
    insertPatient.run('p-102', 'Ramdev Sharma', 'Ramdev Sharma', '9829155402', 'Jaipur', 'Sitapura', 'PHC Beelwa', 'Sitapura Beat 3 & Beelwa Village', 'Type 2 Diabetes + Post Stroke Recovery', 'Critical', 'ASHA-JPR-1001');
    insertPatient.run('p-103', 'Pooja Sharma (Child: Aarav)', 'Mukesh Sharma', '9829155403', 'Jaipur', 'Sanganer', 'CHC Sanganer', 'Pratap Nagar & Sanganer West', 'Infant SAM follow-up + Delayed Pentavalent Vaccine', 'High', 'ANM-JPR-1002');
    insertPatient.run('p-104', 'Kamla Bai', 'Bhanwar Singh', '9829155404', 'Jaipur', 'Sanganer', 'CHC Sanganer', 'Pratap Nagar & Sanganer West', 'Pulmonary TB on Phase 2 DOTS Medication', 'Medium', 'ANM-JPR-1002');
    insertPatient.run('p-105', 'Geeta Gurjar', 'Harish Gurjar', '9829155405', 'Jaipur', 'Sitapura', 'PHC Beelwa', 'Sitapura Beat 3 & Beelwa Village', 'ANC 2nd Trimester Routine Follow-up', 'Low', 'ASHA-JPR-1001');
    insertPatient.run('p-106', 'Suresh Choudhary', 'Suresh Choudhary', '9829155406', 'Jaipur', 'Sitapura', 'PHC Beelwa', 'RICCO Colony Sector 2', 'Hypertension & Chronic Asthma Checkup', 'Medium', null);
    insertPatient.run('p-107', 'Radha Devi', 'Gopal Lal', '9829155407', 'Jaipur', 'Sanganer', 'CHC Sanganer', 'Kacchi Basti Beat 4', 'High-Risk Postnatal Care Day 14', 'High', null);
  }

  // Seed baseline visits for performance & reassignment testing if empty
  const visitCount = db.prepare('SELECT COUNT(*) as count FROM worker_visits').get();
  if (visitCount.count === 0) {
    const insertVisit = db.prepare(`
      INSERT INTO worker_visits (
        visit_id, patient_id, patient_name, worker_id, visit_type, scheduled_date,
        status, completed_date, missed_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Sunita Devi visits (ASHA-JPR-1001): 2 completed, 1 pending, 1 missed
    insertVisit.run('VST-1001', 'p-101', 'Meena Devi', 'ASHA-JPR-1001', 'High-Risk ANC Monitoring', '2026-10-06', 'completed', '2026-10-06', null);
    insertVisit.run('VST-1002', 'p-105', 'Geeta Gurjar', 'ASHA-JPR-1001', 'ANC Nutrition & IFA Checkup', '2026-10-07', 'completed', '2026-10-07', null);
    insertVisit.run('VST-1003', 'p-102', 'Ramdev Sharma', 'ASHA-JPR-1001', 'BP & Blood Sugar Verification', '2026-10-08', 'missed', null, 'Patient unavailable during afternoon beat hours');
    insertVisit.run('VST-1004', 'p-101', 'Meena Devi', 'ASHA-JPR-1001', 'Pre-eclampsia Follow-up Visit', '2026-10-09', 'pending', null, null);

    // Anita Sharma visits (ANM-JPR-1002): 3 completed, 1 pending, 1 missed
    insertVisit.run('VST-1005', 'p-103', 'Pooja Sharma (Child: Aarav)', 'ANM-JPR-1002', 'Pentavalent 3 Immunization', '2026-10-05', 'completed', '2026-10-05', null);
    insertVisit.run('VST-1006', 'p-104', 'Kamla Bai', 'ANM-JPR-1002', 'DOTS Pill Count & Sputum Review', '2026-10-06', 'completed', '2026-10-06', null);
    insertVisit.run('VST-1007', 'p-103', 'Pooja Sharma (Child: Aarav)', 'ANM-JPR-1002', 'MUAC tape & Nutrition Weight Check', '2026-10-07', 'completed', '2026-10-07', null);
    insertVisit.run('VST-1008', 'p-104', 'Kamla Bai', 'ANM-JPR-1002', 'Weekly Compliance Checkup', '2026-10-08', 'missed', null, 'Heavy monsoon waterlogging in sector lane');
    insertVisit.run('VST-1009', 'p-103', 'Pooja Sharma (Child: Aarav)', 'ANM-JPR-1002', 'RUTF Nutritional Sachet Distribution', '2026-10-09', 'pending', null, null);
  }
}

// Run init on load
initDatabase();
