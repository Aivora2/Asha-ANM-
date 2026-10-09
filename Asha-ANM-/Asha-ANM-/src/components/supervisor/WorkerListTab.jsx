import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  User, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Eye, 
  Power, 
  ChevronRight, 
  Loader2, 
  RefreshCw, 
  X, 
  Save, 
  Lock, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

export const WorkerListTab = ({ onNavigateToAddWorker }) => {
  const { showToast } = useApp();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [designationFilter, setDesignationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');

  // Modal States
  const [viewWorker, setViewWorker] = useState(null);
  const [editWorker, setEditWorker] = useState(null);
  const [statusConfirmWorker, setStatusConfirmWorker] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchWorkers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch('/api/supervisor/workers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to fetch workers directory.');
        return;
      }
      setWorkers(data.workers || []);
    } catch (err) {
      console.error('Fetch workers error:', err);
      setError('Network connection error retrieving workers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Filter Logic
  const filteredWorkers = workers.filter((w) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || (
      (w.full_name && w.full_name.toLowerCase().includes(q)) ||
      (w.username && w.username.toLowerCase().includes(q)) ||
      (w.worker_id && w.worker_id.toLowerCase().includes(q)) ||
      (w.mobile_number && w.mobile_number.includes(q)) ||
      (w.beat_area && w.beat_area.toLowerCase().includes(q))
    );

    const matchesDesignation = designationFilter === 'ALL' || w.designation === designationFilter;
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    const matchesArea = areaFilter === 'ALL' || w.beat_area === areaFilter;

    return matchesSearch && matchesDesignation && matchesStatus && matchesArea;
  });

  // Unique beat areas for filter dropdown
  const uniqueBeats = Array.from(new Set(workers.map(w => w.beat_area).filter(Boolean)));

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Copied "${text}"`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Toggle Worker Status
  const handleToggleStatusConfirm = async () => {
    if (!statusConfirmWorker) return;
    const nextStatus = statusConfirmWorker.status === 'Active' ? 'Inactive' : 'Active';
    setActionLoading(true);
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch(`/api/supervisor/workers/${statusConfirmWorker.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed to change worker status.');
        return;
      }
      showToast(data.message || `Worker marked as ${nextStatus}`);
      setStatusConfirmWorker(null);
      fetchWorkers();
    } catch (err) {
      showToast('Error communicating with server.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit Worker Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editWorker) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch(`/api/supervisor/workers/${editWorker.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editWorker)
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed to update worker details.');
        return;
      }
      showToast('Worker details updated successfully!');
      setEditWorker(null);
      fetchWorkers();
    } catch (err) {
      showToast('Server update error.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="supervisor-tab-content-wrapper">
      {/* Header Card */}
      <div className="supervisor-section-header-card">
        <div className="supervisor-section-icon-box">
          <Users size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="supervisor-section-title">ASHA & ANM Worker Directory</h2>
          <p className="supervisor-section-desc">
            Manage field healthcare cadres, inspect visit completion metrics, update beat assignments, and activate or suspend worker credentials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn-text-action"
            onClick={fetchWorkers}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {onNavigateToAddWorker && (
            <button
              type="button"
              className="btn-auth-primary"
              style={{ width: 'auto', padding: '8px 16px' }}
              onClick={onNavigateToAddWorker}
            >
              <span>+ Add Worker</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="worker-filter-strip">
        <div className="filter-search-box">
          <Search size={16} className="filter-icon" />
          <input
            type="text"
            placeholder="Search by worker name, username, ID, beat or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="filter-clear-btn"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-controls-group">
          {/* Designation */}
          <div className="filter-select-wrap">
            <span className="filter-label-prefix">Cadre:</span>
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Cadres</option>
              <option value="ASHA">ASHA Only</option>
              <option value="ANM">ANM Only</option>
            </select>
          </div>

          {/* Area / Beat */}
          <div className="filter-select-wrap">
            <span className="filter-label-prefix">Beat:</span>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Beats</option>
              {uniqueBeats.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="filter-select-wrap">
            <span className="filter-label-prefix">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* ERROR OR LOADING */}
      {loading && (
        <div className="supervisor-empty-state">
          <Loader2 size={32} className="animate-spin" color="#059669" />
          <p>Loading worker directory from database...</p>
        </div>
      )}

      {error && !loading && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* EMPTY DIRECTORY */}
      {!loading && !error && filteredWorkers.length === 0 && (
        <div className="supervisor-empty-state">
          <Users size={40} color="#94a3b8" />
          <h3>No Workers Found</h3>
          <p>
            {searchTerm || designationFilter !== 'ALL' || statusFilter !== 'ALL' || areaFilter !== 'ALL'
              ? 'No workers match the selected filters or search terms. Try clearing filters.'
              : 'No healthcare workers have been registered yet under this primary health jurisdiction.'}
          </p>
          {onNavigateToAddWorker && (
            <button
              type="button"
              className="btn-auth-primary"
              style={{ width: 'auto', marginTop: 12 }}
              onClick={onNavigateToAddWorker}
            >
              <span>Register First Worker</span>
            </button>
          )}
        </div>
      )}

      {/* WORKERS TABLE / GRID */}
      {!loading && !error && filteredWorkers.length > 0 && (
        <div className="worker-directory-table-card">
          <div className="table-responsive-wrapper">
            <table className="worker-table">
              <thead>
                <tr>
                  <th>Worker Name & Username</th>
                  <th>ID & Cadre</th>
                  <th>Assigned Beat Area</th>
                  <th>Assigned Patients</th>
                  <th>Visit Metrics</th>
                  <th>Completion Rate</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((w) => {
                  const initials = (w.full_name || 'W').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={w.id} className={w.status === 'Inactive' ? 'row-inactive' : ''}>
                      {/* Name & Username */}
                      <td>
                        <div className="worker-cell-profile">
                          {w.profile_photo ? (
                            <img src={w.profile_photo} alt={w.full_name} className="worker-mini-avatar" />
                          ) : (
                            <div className="worker-mini-avatar-fallback">{initials}</div>
                          )}
                          <div>
                            <div className="worker-cell-name">{w.full_name}</div>
                            <div className="worker-cell-username">
                              <span>@{w.username}</span>
                              <button
                                type="button"
                                className="cell-copy-btn"
                                onClick={() => handleCopy(w.username, `user-${w.id}`)}
                                title="Copy Username"
                              >
                                {copiedId === `user-${w.id}` ? <Check size={11} color="#059669" /> : <Copy size={11} />}
                              </button>
                            </div>
                            <div className="worker-cell-phone">
                              <Phone size={11} />
                              <span>{w.mobile_number}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ID & Cadre */}
                      <td>
                        <div className="worker-id-tag">{w.worker_id}</div>
                        <span className={`cadre-badge ${w.designation === 'ANM' ? 'anm-badge' : 'asha-badge'}`}>
                          {w.designation}
                        </span>
                      </td>

                      {/* Assigned Beat Area */}
                      <td>
                        <div className="beat-name-text">
                          <MapPin size={13} color="#059669" />
                          <span>{w.beat_area || 'Unassigned'}</span>
                        </div>
                        <div className="facility-subtext">{w.facility_name}</div>
                      </td>

                      {/* Assigned Patients/Families */}
                      <td>
                        <div className="patient-count-badge">
                          <strong>{w.assignedPatientsCount}</strong>
                          <span>families</span>
                        </div>
                      </td>

                      {/* Visit Metrics */}
                      <td>
                        <div className="visits-mini-breakdown">
                          <span className="v-stat done" title="Completed Visits">
                            <CheckCircle2 size={11} /> {w.completedVisits} done
                          </span>
                          <span className="v-stat pend" title="Pending Visits">
                            <Clock size={11} /> {w.pendingVisits} pend
                          </span>
                          <span className="v-stat miss" title="Missed Visits">
                            <AlertTriangle size={11} /> {w.missedVisits} miss
                          </span>
                        </div>
                      </td>

                      {/* Completion Rate */}
                      <td>
                        <div className="completion-rate-cell">
                          <div className="rate-text">
                            <strong>{w.completionRate}</strong>
                          </div>
                          {w.completionRate !== 'N/A' && (
                            <div className="mini-progress-bar">
                              <div
                                className="mini-progress-fill"
                                style={{
                                  width: w.completionRate,
                                  background: parseInt(w.completionRate) >= 80 ? '#059669' : parseInt(w.completionRate) >= 50 ? '#d97706' : '#dc2626'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-pill status-${(w.status || 'Active').toLowerCase().replace(/\s+/g, '-')}`}>
                          {w.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="actions-cell-buttons">
                          <button
                            type="button"
                            className="btn-table-icon"
                            title="View Worker Details"
                            onClick={() => setViewWorker(w)}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            className="btn-table-icon"
                            title="Edit Worker & Beat"
                            onClick={() => setEditWorker({ ...w })}
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            className={`btn-table-icon ${w.status === 'Active' ? 'btn-deactivate' : 'btn-activate'}`}
                            title={w.status === 'Active' ? 'Deactivate Worker' : 'Activate Worker'}
                            onClick={() => setStatusConfirmWorker(w)}
                          >
                            <Power size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 1: VIEW WORKER DETAILS
          ==================================================================== */}
      {viewWorker && (
        <div className="profile-popup-backdrop" onClick={() => setViewWorker(null)}>
          <div className="supervisor-profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Worker Record: {viewWorker.full_name}
              </h3>
              <button
                type="button"
                onClick={() => setViewWorker(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20 }}>
              {viewWorker.profile_photo ? (
                <img src={viewWorker.profile_photo} alt={viewWorker.full_name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
                  {(viewWorker.full_name || 'W').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{viewWorker.full_name}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                  <span className={`cadre-badge ${viewWorker.designation === 'ANM' ? 'anm-badge' : 'asha-badge'}`}>{viewWorker.designation}</span>
                  <span className="worker-id-tag">{viewWorker.worker_id}</span>
                  <span className={`status-pill status-${(viewWorker.status || 'Active').toLowerCase()}`}>{viewWorker.status}</span>
                </div>
              </div>
            </div>

            <div className="worker-view-grid">
              <div className="view-detail-card">
                <span className="view-label">Generated Login Username:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="view-val" style={{ fontFamily: 'monospace', fontWeight: 700, color: '#059669' }}>
                    @{viewWorker.username}
                  </span>
                  <button type="button" className="cell-copy-btn" onClick={() => handleCopy(viewWorker.username, 'modal-u')}>
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div className="view-detail-card">
                <span className="view-label">Mobile Contact:</span>
                <span className="view-val">{viewWorker.mobile_number}</span>
              </div>

              <div className="view-detail-card">
                <span className="view-label">Assigned Beat & Village:</span>
                <span className="view-val">{viewWorker.beat_area}</span>
              </div>

              <div className="view-detail-card">
                <span className="view-label">Facility & Block:</span>
                <span className="view-val">{viewWorker.facility_name}, {viewWorker.block}</span>
              </div>

              <div className="view-detail-card">
                <span className="view-label">Assigned Patients / Caseload:</span>
                <span className="view-val">{viewWorker.assignedPatientsCount} registered families</span>
              </div>

              <div className="view-detail-card">
                <span className="view-label">Visit Compliance:</span>
                <span className="view-val">
                  {viewWorker.completedVisits} completed • {viewWorker.pendingVisits} pending • {viewWorker.missedVisits} missed ({viewWorker.completionRate})
                </span>
              </div>

              <div className="view-detail-card">
                <span className="view-label">Joining Date:</span>
                <span className="view-val">{viewWorker.joining_date || 'N/A'}</span>
              </div>

              <div className="view-detail-card">
                <span className="view-label">Gender / DOB:</span>
                <span className="view-val">{viewWorker.gender} • {viewWorker.dob}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button
                type="button"
                className="btn-auth-back"
                onClick={() => setViewWorker(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-auth-primary"
                style={{ width: 'auto' }}
                onClick={() => {
                  const w = viewWorker;
                  setViewWorker(null);
                  setEditWorker({ ...w });
                }}
              >
                <Edit3 size={15} />
                <span>Edit Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: EDIT WORKER DETAILS
          ==================================================================== */}
      {editWorker && (
        <div className="profile-popup-backdrop" onClick={() => setEditWorker(null)}>
          <div className="supervisor-profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Edit Worker: {editWorker.full_name}
              </h3>
              <button
                type="button"
                onClick={() => setEditWorker(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="auth-form-group">
                  <label className="auth-form-label">Full Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={editWorker.full_name || ''}
                    onChange={(e) => setEditWorker({ ...editWorker, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="auth-input"
                    maxLength={10}
                    value={editWorker.mobile_number || ''}
                    onChange={(e) => setEditWorker({ ...editWorker, mobile_number: e.target.value })}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Cadre Designation</label>
                  <select
                    className="auth-input"
                    value={editWorker.designation || 'ASHA'}
                    onChange={(e) => setEditWorker({ ...editWorker, designation: e.target.value })}
                  >
                    <option value="ASHA">ASHA</option>
                    <option value="ANM">ANM</option>
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Status</label>
                  <select
                    className="auth-input"
                    value={editWorker.status || 'Active'}
                    onChange={(e) => setEditWorker({ ...editWorker, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Assigned Beat Area</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={editWorker.beat_area || ''}
                    onChange={(e) => setEditWorker({ ...editWorker, beat_area: e.target.value })}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Health Facility</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={editWorker.facility_name || ''}
                    onChange={(e) => setEditWorker({ ...editWorker, facility_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-auth-back"
                  onClick={() => setEditWorker(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-auth-primary"
                  style={{ width: 'auto' }}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: STATUS TOGGLE CONFIRMATION
          ==================================================================== */}
      {statusConfirmWorker && (
        <div className="profile-popup-backdrop" onClick={() => setStatusConfirmWorker(null)}>
          <div className="supervisor-profile-modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: statusConfirmWorker.status === 'Active' ? '#fee2e2' : '#ecfdf5', color: statusConfirmWorker.status === 'Active' ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Power size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px' }}>
                {statusConfirmWorker.status === 'Active' ? 'Deactivate Worker?' : 'Activate Worker?'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                Are you sure you want to mark <strong>{statusConfirmWorker.full_name}</strong> ({statusConfirmWorker.worker_id}) as{' '}
                <strong>{statusConfirmWorker.status === 'Active' ? 'Inactive' : 'Active'}</strong>?
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="btn-auth-back"
                style={{ flex: 1 }}
                onClick={() => setStatusConfirmWorker(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-auth-primary"
                style={{
                  flex: 1,
                  background: statusConfirmWorker.status === 'Active' ? '#dc2626' : '#059669',
                  borderColor: statusConfirmWorker.status === 'Active' ? '#dc2626' : '#059669'
                }}
                onClick={handleToggleStatusConfirm}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Confirm {statusConfirmWorker.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
