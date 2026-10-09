import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Building2, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Loader2, 
  Plus, 
  Edit3, 
  Briefcase, 
  UserCheck, 
  X,
  Save,
  Search
} from 'lucide-react';

export const WorkerAssignmentTab = () => {
  const { user, showToast } = useApp();

  const [areas, setAreas] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reassignment Modal State
  const [assignModalWorker, setAssignModalWorker] = useState(null);
  const [targetBeat, setTargetBeat] = useState('');
  const [targetFacility, setTargetFacility] = useState('');
  const [savingAssignment, setSavingAssignment] = useState(false);

  // Search filter
  const [searchArea, setSearchArea] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const [areasRes, workersRes] = await fetchAllData(token);

      if (areasRes.ok && workersRes.ok) {
        const aData = await areasRes.json();
        const wData = await workersRes.json();
        setAreas(aData.areas || []);
        setWorkers(wData.workers || []);
      } else {
        setError('Failed to load area allocation data.');
      }
    } catch (err) {
      console.error('Fetch area assignment data error:', err);
      setError('Connection failure loading area allocations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = (token) => {
    return Promise.all([
      fetch('/api/supervisor/areas', { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch('/api/supervisor/workers', { headers: { 'Authorization': `Bearer ${token}` } })
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAssignModal = (worker) => {
    setAssignModalWorker(worker);
    setTargetBeat(worker.beat_area || '');
    setTargetFacility(worker.facility_name || user?.facilityName || 'PHC Beelwa');
  };

  const handleSaveAreaAssignment = async (e) => {
    e.preventDefault();
    if (!assignModalWorker || !targetBeat.trim()) return;

    setSavingAssignment(true);
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch(`/api/supervisor/workers/${assignModalWorker.id}/area`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          beatArea: targetBeat.trim(),
          facilityName: targetFacility.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed to update beat assignment.');
        return;
      }

      showToast(data.message || 'Beat assignment updated successfully!');
      setAssignModalWorker(null);
      fetchData();
    } catch (err) {
      showToast('Network error saving assignment.');
    } finally {
      setSavingAssignment(false);
    }
  };

  const filteredAreas = areas.filter(a => {
    const q = searchArea.toLowerCase().trim();
    return !q || (
      (a.beat && a.beat.toLowerCase().includes(q)) ||
      (a.facility && a.facility.toLowerCase().includes(q)) ||
      (a.block && a.block.toLowerCase().includes(q))
    );
  });

  return (
    <div className="supervisor-tab-content-wrapper">
      {/* Header Card */}
      <div className="supervisor-section-header-card">
        <div className="supervisor-section-icon-box">
          <MapPin size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="supervisor-section-title">Area-wise Worker & Beat Assignment</h2>
          <p className="supervisor-section-desc">
            Coordinate healthcare beat boundaries, village cluster deployments, and patient caseload distribution per primary health worker.
          </p>
        </div>

        <button
          type="button"
          className="btn-text-action"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="worker-filter-strip">
        <div className="filter-search-box" style={{ maxWidth: 460 }}>
          <Search size={16} className="filter-icon" />
          <input
            type="text"
            placeholder="Search beat, village, or PHC facility..."
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            className="filter-search-input"
          />
          {searchArea && (
            <button
              type="button"
              onClick={() => setSearchArea('')}
              className="filter-clear-btn"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
          Showing {filteredAreas.length} health beats under supervisor jurisdiction
        </div>
      </div>

      {loading && (
        <div className="supervisor-empty-state">
          <Loader2 size={32} className="animate-spin" color="#059669" />
          <p>Analyzing area-wise allocations and worker assignments...</p>
        </div>
      )}

      {error && !loading && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="areas-grid-container">
          {filteredAreas.map((area) => (
            <div key={area.beat} className={`area-allocation-card ${area.isUnassigned ? 'card-unassigned' : ''}`}>
              {/* Card Top */}
              <div className="area-card-header">
                <div>
                  <div className="area-beat-title">
                    <MapPin size={18} color="#059669" />
                    <span>{area.beat}</span>
                  </div>
                  <div className="area-facility-sub">
                    <Building2 size={13} />
                    <span>{area.facility || 'PHC Base'} • {area.block || 'Sitapura'}</span>
                  </div>
                </div>

                <div className="area-badge-cluster">
                  <span className="area-patient-pill">
                    <strong>{area.patientsCount}</strong> registered families
                  </span>
                  {area.isUnassigned && (
                    <span className="area-unassigned-pill">
                      No Worker Assigned
                    </span>
                  )}
                </div>
              </div>

              {/* Workers Assigned in this Beat */}
              <div className="area-workers-list">
                <div className="area-workers-heading">
                  <Users size={14} />
                  <span>Assigned Healthcare Cadres ({area.assignedWorkersCount})</span>
                </div>

                {area.assignedWorkers.length === 0 ? (
                  <div className="area-no-workers-box">
                    <AlertCircle size={15} color="#d97706" />
                    <span>This beat currently has no active field worker deployed.</span>
                  </div>
                ) : (
                  <div className="area-workers-chips">
                    {area.assignedWorkers.map((w) => (
                      <div key={w.worker_id} className="area-worker-chip">
                        <div className="chip-avatar">
                          {w.designation}
                        </div>
                        <div className="chip-info">
                          <span className="chip-name">{w.full_name}</span>
                          <span className="chip-id">{w.worker_id}</span>
                        </div>
                        <button
                          type="button"
                          className="chip-reassign-btn"
                          title="Change Beat Assignment"
                          onClick={() => {
                            const fullWorker = workers.find(item => item.worker_id === w.worker_id) || w;
                            handleOpenAssignModal(fullWorker);
                          }}
                        >
                          <Edit3 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QUICK ASSIGNMENT OVERVIEW STRIP: ALL WORKERS WITH ACTION */}
      {!loading && !error && workers.length > 0 && (
        <div className="worker-assignment-master-card">
          <h3 className="master-card-title">
            <UserCheck size={18} />
            <span>Worker Field Beat Master List</span>
          </h3>

          <div className="table-responsive-wrapper">
            <table className="worker-table">
              <thead>
                <tr>
                  <th>Worker Name & Cadre</th>
                  <th>Worker ID</th>
                  <th>Current Assigned Beat</th>
                  <th>Caseload Workload</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Reassign Beat</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <strong>{w.full_name}</strong>
                      <span className={`cadre-badge ${w.designation === 'ANM' ? 'anm-badge' : 'asha-badge'}`} style={{ marginLeft: 8 }}>
                        {w.designation}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{w.worker_id}</td>
                    <td>
                      <div className="beat-name-text">
                        <MapPin size={13} color="#059669" />
                        <span>{w.beat_area || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="patient-count-badge">
                        {w.assignedPatientsCount || 0} families
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${(w.status || 'Active').toLowerCase()}`}>
                        {w.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-auth-back"
                        style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleOpenAssignModal(w)}
                      >
                        <Edit3 size={13} />
                        <span>Update Beat</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ASSIGN / UPDATE WORKER BEAT AREA
          ==================================================================== */}
      {assignModalWorker && (
        <div className="profile-popup-backdrop" onClick={() => setAssignModalWorker(null)}>
          <div className="supervisor-profile-modal-card" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Update Beat Assignment
              </h3>
              <button
                type="button"
                onClick={() => setAssignModalWorker(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, marginBottom: 18 }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Selected Healthcare Cadre:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {assignModalWorker.full_name} ({assignModalWorker.worker_id})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: 4 }}>
                Currently in: {assignModalWorker.beat_area || 'Unassigned'}
              </div>
            </div>

            <form onSubmit={handleSaveAreaAssignment}>
              <div className="auth-form-group">
                <label className="auth-form-label">New Village / Beat Area *</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Beelwa Kalan, Shiv Nagar, Sitapura Ind"
                  value={targetBeat}
                  onChange={(e) => setTargetBeat(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Health Facility Base (PHC/CHC) *</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. PHC Beelwa"
                  value={targetFacility}
                  onChange={(e) => setTargetFacility(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-auth-back"
                  onClick={() => setAssignModalWorker(null)}
                  disabled={savingAssignment}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-auth-primary"
                  style={{ width: 'auto' }}
                  disabled={savingAssignment}
                >
                  {savingAssignment ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Beat Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
