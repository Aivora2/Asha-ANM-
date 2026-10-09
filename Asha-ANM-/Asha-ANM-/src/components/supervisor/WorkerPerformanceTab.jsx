import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  RefreshCw, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  UserCheck, 
  X, 
  Send
} from 'lucide-react';

export const WorkerPerformanceTab = () => {
  const { showToast } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [workerMetrics, setWorkerMetrics] = useState([]);
  const [missedVisits, setMissedVisits] = useState([]);

  // Missed Visit Reassignment Modal
  const [selectedMissedVisit, setSelectedMissedVisit] = useState(null);
  const [destinationWorkerId, setDestinationWorkerId] = useState('');
  const [reassignNotes, setReassignNotes] = useState('');
  const [reassigning, setReassigning] = useState(false);

  const fetchPerformance = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const [perfRes, missedRes] = await Promise.all([
        fetch('/api/supervisor/performance', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/supervisor/visits/missed', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (perfRes.ok && missedRes.ok) {
        const perfData = await perfRes.json();
        const missedData = await missedRes.json();

        setSummary(perfData.summary);
        setWorkerMetrics(perfData.workerMetrics || []);
        setMissedVisits(missedData.missedVisits || []);
      } else {
        setError('Failed to compute supervisor performance figures.');
      }
    } catch (err) {
      console.error('Performance fetch error:', err);
      setError('Network communication error fetching performance metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const handleOpenReassign = (visit) => {
    setSelectedMissedVisit(visit);
    // Default destination worker to first active worker who isn't the original one
    const eligible = workerMetrics.filter(w => w.status === 'Active' && w.worker_id !== visit.worker_id);
    setDestinationWorkerId(eligible.length > 0 ? eligible[0].worker_id : '');
    setReassignNotes(`Priority catch-up visit allocated by supervisor.`);
  };

  const handleConfirmReassign = async (e) => {
    e.preventDefault();
    if (!selectedMissedVisit || !destinationWorkerId) return;

    setReassigning(true);
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch(`/api/supervisor/visits/${selectedMissedVisit.id}/reassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reassignToWorkerId: destinationWorkerId,
          notes: reassignNotes
        })
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed to reassign missed visit.');
        return;
      }

      showToast(data.message || 'Missed visit successfully reassigned!');
      setSelectedMissedVisit(null);
      fetchPerformance();
    } catch (err) {
      showToast('Network error reassigning visit.');
    } finally {
      setReassigning(false);
    }
  };

  // Eligible active workers for reassignment
  const activeWorkers = workerMetrics.filter(w => w.status === 'Active');

  return (
    <div className="supervisor-tab-content-wrapper">
      {/* Header Card */}
      <div className="supervisor-section-header-card">
        <div className="supervisor-section-icon-box">
          <Award size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="supervisor-section-title">Field Performance & Compliance Monitoring</h2>
          <p className="supervisor-section-desc">
            Evidence-based maternal, immunization, and antenatal visit tracking. Reassign missed visits directly to active field cadres.
          </p>
        </div>

        <button
          type="button"
          className="btn-text-action"
          onClick={fetchPerformance}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && (
        <div className="supervisor-empty-state">
          <Loader2 size={32} className="animate-spin" color="#059669" />
          <p>Compiling live visit records and performance indices from SQLite...</p>
        </div>
      )}

      {error && !loading && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY KPI METRICS STRIP */}
      {!loading && !error && summary && (
        <div className="perf-kpi-grid">
          {/* Completed Visits */}
          <div className="perf-kpi-card kpi-completed">
            <div className="kpi-top">
              <span className="kpi-title">Completed Visits</span>
              <div className="kpi-icon-wrap done">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="kpi-value">{summary.totalCompleted}</div>
            <div className="kpi-subtext">Verified household interactions</div>
          </div>

          {/* Pending Visits */}
          <div className="perf-kpi-card kpi-pending">
            <div className="kpi-top">
              <span className="kpi-title">Pending Visits</span>
              <div className="kpi-icon-wrap pend">
                <Clock size={18} />
              </div>
            </div>
            <div className="kpi-value">{summary.totalPending}</div>
            <div className="kpi-subtext">Scheduled & due for completion</div>
          </div>

          {/* Missed Visits */}
          <div className="perf-kpi-card kpi-missed">
            <div className="kpi-top">
              <span className="kpi-title">Missed Visits</span>
              <div className="kpi-icon-wrap miss">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="kpi-value">{summary.totalMissed}</div>
            <div className="kpi-subtext">Requires officer reassignment</div>
          </div>

          {/* Overall Completion Rate */}
          <div className="perf-kpi-card kpi-rate">
            <div className="kpi-top">
              <span className="kpi-title">Visit Completion Rate</span>
              <div className="kpi-icon-wrap rate">
                <Award size={18} />
              </div>
            </div>
            <div className="kpi-value">{summary.overallCompletionRate}</div>
            <div className="kpi-subtext">Completed / Total Due Visits</div>
          </div>

          {/* Total Workload */}
          <div className="perf-kpi-card kpi-workload">
            <div className="kpi-top">
              <span className="kpi-title">Total Active Workload</span>
              <div className="kpi-icon-wrap work">
                <Users size={18} />
              </div>
            </div>
            <div className="kpi-value">{summary.totalWorkload}</div>
            <div className="kpi-subtext">{summary.totalPatients} families + {summary.totalPending} pending visits</div>
          </div>
        </div>
      )}

      {/* WORKER-WISE PERFORMANCE TABLE */}
      {!loading && !error && workerMetrics.length > 0 && (
        <div className="worker-assignment-master-card">
          <h3 className="master-card-title">
            <Award size={18} />
            <span>Worker-wise Performance & Workload Breakdown</span>
          </h3>

          <div className="table-responsive-wrapper">
            <table className="worker-table">
              <thead>
                <tr>
                  <th>Worker Name & Beat</th>
                  <th>Assigned Families</th>
                  <th>Completed</th>
                  <th>Pending</th>
                  <th>Missed</th>
                  <th>Completion Rate</th>
                  <th>Workload Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {workerMetrics.map((w) => (
                  <tr key={w.worker_id}>
                    <td>
                      <div>
                        <strong>{w.full_name}</strong>
                        <span className={`cadre-badge ${w.designation === 'ANM' ? 'anm-badge' : 'asha-badge'}`} style={{ marginLeft: 8 }}>
                          {w.designation}
                        </span>
                      </div>
                      <div className="facility-subtext">{w.beat_area}</div>
                    </td>
                    <td>
                      <span className="patient-count-badge">
                        {w.assignedPatients} families
                      </span>
                    </td>
                    <td>
                      <span className="v-stat done">
                        <CheckCircle2 size={12} /> {w.completedVisits}
                      </span>
                    </td>
                    <td>
                      <span className="v-stat pend">
                        <Clock size={12} /> {w.pendingVisits}
                      </span>
                    </td>
                    <td>
                      <span className="v-stat miss">
                        <AlertTriangle size={12} /> {w.missedVisits}
                      </span>
                    </td>
                    <td>
                      <div className="completion-rate-cell">
                        <strong>{w.completionRate}</strong>
                        {w.completionRate !== 'N/A' && (
                          <div className="mini-progress-bar">
                            <div
                              className="mini-progress-fill"
                              style={{
                                width: w.completionRate,
                                background: w.completionRateNum >= 80 ? '#059669' : w.completionRateNum >= 50 ? '#d97706' : '#dc2626'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#334155' }}>
                        {w.workload}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${(w.status || 'Active').toLowerCase()}`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MISSED VISITS REASSIGNMENT SECTION */}
      {!loading && !error && (
        <div className="worker-assignment-master-card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="master-card-title" style={{ margin: 0 }}>
              <AlertTriangle size={18} color="#d97706" />
              <span>Missed Visit Catch-Up & Reassignment Queue ({missedVisits.length})</span>
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Assign missed clinical visits to alternative active field workers
            </span>
          </div>

          {missedVisits.length === 0 ? (
            <div className="area-no-workers-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span style={{ color: '#047857', fontWeight: 600 }}>
                Excellent! There are currently no unresolved missed visits in this sector.
              </span>
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="worker-table">
                <thead>
                  <tr>
                    <th>Patient / Mother Name</th>
                    <th>Visit Type</th>
                    <th>Original Worker</th>
                    <th>Scheduled Date</th>
                    <th>Reported Missed Reason</th>
                    <th style={{ textAlign: 'right' }}>Reassign Action</th>
                  </tr>
                </thead>
                <tbody>
                  {missedVisits.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <strong>{v.patient_name}</strong>
                        <div className="facility-subtext">ID: {v.patient_id}</div>
                      </td>
                      <td>
                        <span className="cadre-badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                          {v.visit_type}
                        </span>
                      </td>
                      <td>
                        <div>{v.worker_name || v.worker_id}</div>
                        <div className="facility-subtext">{v.worker_beat}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
                          <Calendar size={13} color="#64748b" />
                          <span>{v.scheduled_date}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 500 }}>
                          {v.missed_reason || 'Worker unavailable'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-auth-primary"
                          style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
                          onClick={() => handleOpenReassign(v)}
                        >
                          <Send size={13} />
                          <span>Reassign Visit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          MODAL: REASSIGN MISSED VISIT
          ==================================================================== */}
      {selectedMissedVisit && (
        <div className="profile-popup-backdrop" onClick={() => setSelectedMissedVisit(null)}>
          <div className="supervisor-profile-modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Reassign Missed Visit
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMissedVisit(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 14, borderRadius: 10, marginBottom: 18 }}>
              <div style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 700 }}>
                Visit Details:
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#78350f', marginTop: 4 }}>
                {selectedMissedVisit.visit_type} for {selectedMissedVisit.patient_name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: 2 }}>
                Originally assigned to: {selectedMissedVisit.worker_name} ({selectedMissedVisit.worker_id})
              </div>
            </div>

            <form onSubmit={handleConfirmReassign}>
              <div className="auth-form-group">
                <label className="auth-form-label">Select Reassignment Destination Worker *</label>
                <select
                  className="auth-input"
                  value={destinationWorkerId}
                  onChange={(e) => setDestinationWorkerId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Active Worker --</option>
                  {activeWorkers.map((w) => (
                    <option key={w.worker_id} value={w.worker_id}>
                      {w.full_name} ({w.designation} • {w.beat_area} • Current Workload: {w.workload})
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Supervisor Reassignment Notes / Directive</label>
                <input
                  type="text"
                  className="auth-input"
                  value={reassignNotes}
                  onChange={(e) => setReassignNotes(e.target.value)}
                  placeholder="e.g. Expedite within 48 hours"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-auth-back"
                  onClick={() => setSelectedMissedVisit(null)}
                  disabled={reassigning}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-auth-primary"
                  style={{ width: 'auto' }}
                  disabled={reassigning || !destinationWorkerId}
                >
                  {reassigning ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>Confirm Reassignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
