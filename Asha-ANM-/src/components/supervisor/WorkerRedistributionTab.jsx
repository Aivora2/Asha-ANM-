import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RefreshCw, 
  ArrowRight, 
  Users, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  X
} from 'lucide-react';

export const WorkerRedistributionTab = () => {
  const { showToast } = useApp();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Source & Destination Workers
  const [sourceWorkerId, setSourceWorkerId] = useState('');
  const [destinationWorkerId, setDestinationWorkerId] = useState('');

  // Patients of Source Worker
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatientIds, setSelectedPatientIds] = useState([]);

  // Reason & Confirmation
  const [transferReason, setTransferReason] = useState('Caseload rebalancing & beat optimization');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [transferResult, setTransferResult] = useState(null);

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
        setError(data.error || 'Failed to fetch workers.');
        return;
      }
      setWorkers(data.workers || []);
      if (data.workers && data.workers.length > 0) {
        setSourceWorkerId(data.workers[0].worker_id);
      }
    } catch (err) {
      console.error('Fetch workers for redistribution error:', err);
      setError('Network communication error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Whenever source worker changes, fetch their patient assignments
  useEffect(() => {
    if (!sourceWorkerId) {
      setPatients([]);
      setSelectedPatientIds([]);
      return;
    }

    const fetchPatients = async () => {
      setPatientsLoading(true);
      setSelectedPatientIds([]);
      try {
        const token = localStorage.getItem('ek_asha_supervisor_token');
        const response = await fetch(`/api/supervisor/patients?workerId=${sourceWorkerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setPatients(data.patients || []);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error('Fetch source patients error:', err);
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, [sourceWorkerId]);

  const sourceWorker = workers.find(w => w.worker_id === sourceWorkerId);
  const destinationWorker = workers.find(w => w.worker_id === destinationWorkerId);

  // Eligible destination candidates (cannot be source worker)
  const destinationOptions = workers.filter(w => w.worker_id !== sourceWorkerId && w.status === 'Active');

  const handleTogglePatient = (id) => {
    setSelectedPatientIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPatientIds.length === patients.length) {
      setSelectedPatientIds([]);
    } else {
      setSelectedPatientIds(patients.map(p => p.patient_id));
    }
  };

  const handleConfirmTransfer = async () => {
    if (!sourceWorkerId || !destinationWorkerId || selectedPatientIds.length === 0) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('ek_asha_supervisor_token');
      const response = await fetch('/api/supervisor/redistribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sourceWorkerId,
          destinationWorkerId,
          patientIds: selectedPatientIds,
          reason: transferReason
        })
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed to complete redistribution.');
        return;
      }

      setTransferResult(data);
      showToast(data.message || 'Caseload redistribution successfully saved to SQLite.');
      setShowConfirmModal(false);
      setSelectedPatientIds([]);
      // Refresh workers and current patient list
      fetchWorkers();
    } catch (err) {
      showToast('Network error processing redistribution.');
    } finally {
      setSubmitting(false);
    }
  };

  // Projected workloads
  const countToTransfer = selectedPatientIds.length;
  const sourceProjected = Math.max(0, (sourceWorker?.assignedPatientsCount || 0) - countToTransfer);
  const destProjected = (destinationWorker?.assignedPatientsCount || 0) + countToTransfer;

  return (
    <div className="supervisor-tab-content-wrapper">
      {/* Header Card */}
      <div className="supervisor-section-header-card">
        <div className="supervisor-section-icon-box">
          <RefreshCw size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="supervisor-section-title">Field Worker Caseload Redistribution</h2>
          <p className="supervisor-section-desc">
            Reallocate patient family registers between workers during leave, surge, or uneven beat density. Caseload counts and open pending visits transfer atomically in SQLite.
          </p>
        </div>
      </div>

      {loading && (
        <div className="supervisor-empty-state">
          <Loader2 size={32} className="animate-spin" color="#059669" />
          <p>Loading worker caseload matrices...</p>
        </div>
      )}

      {error && !loading && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUCCESS TRANSFER BANNER */}
      {transferResult && (
        <div className="worker-onboard-success-card" style={{ marginBottom: 24 }}>
          <div className="success-banner-top">
            <CheckCircle2 size={28} color="#059669" />
            <div style={{ flex: 1 }}>
              <h3 className="success-banner-title">Caseload Redistribution Complete</h3>
              <p className="success-banner-subtitle">{transferResult.message}</p>
            </div>
            <button
              type="button"
              className="filter-clear-btn"
              onClick={() => setTransferResult(null)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="redistribution-workspace-grid">
          {/* STEP 1: SELECT WORKERS & VIEW IMPACT */}
          <div className="redistribution-selector-panel">
            <h3 className="form-section-heading" style={{ marginBottom: 16 }}>
              <Users size={18} />
              <span>1. Select Reassignment Source & Destination</span>
            </h3>

            {/* Source Worker */}
            <div className="auth-form-group">
              <label className="auth-form-label">Source Healthcare Worker (Current Caseload)</label>
              <select
                className="auth-input"
                value={sourceWorkerId}
                onChange={(e) => {
                  setSourceWorkerId(e.target.value);
                  if (destinationWorkerId === e.target.value) {
                    setDestinationWorkerId('');
                  }
                }}
              >
                {workers.map((w) => (
                  <option key={w.worker_id} value={w.worker_id}>
                    {w.full_name} ({w.designation} • {w.beat_area} • {w.assignedPatientsCount || 0} families)
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Worker */}
            <div className="auth-form-group">
              <label className="auth-form-label">Destination Healthcare Worker (Recipient)</label>
              <select
                className="auth-input"
                value={destinationWorkerId}
                onChange={(e) => setDestinationWorkerId(e.target.value)}
              >
                <option value="">-- Choose Destination Worker --</option>
                {destinationOptions.map((w) => (
                  <option key={w.worker_id} value={w.worker_id}>
                    {w.full_name} ({w.designation} • {w.beat_area} • Current: {w.assignedPatientsCount || 0} families)
                  </option>
                ))}
              </select>
            </div>

            {/* Transfer Reason */}
            <div className="auth-form-group">
              <label className="auth-form-label">Redistribution Administrative Reason</label>
              <input
                type="text"
                className="auth-input"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="e.g. Worker maternity leave / Beat load balance"
              />
            </div>

            {/* WORKLOAD COMPARISON CARD */}
            {sourceWorker && destinationWorker && (
              <div className="workload-comparison-card">
                <h4 className="comparison-title">Caseload Projection Preview</h4>
                
                <div className="comparison-row">
                  <div className="comparison-col">
                    <span className="col-worker-name">{sourceWorker.full_name}</span>
                    <span className="col-role">Source Worker</span>
                    <div className="col-metrics">
                      <span className="metric-prev">{sourceWorker.assignedPatientsCount || 0}</span>
                      <ArrowRight size={14} color="#64748b" />
                      <span className="metric-next">{sourceProjected} families</span>
                    </div>
                  </div>

                  <div className="comparison-divider" />

                  <div className="comparison-col">
                    <span className="col-worker-name">{destinationWorker.full_name}</span>
                    <span className="col-role">Recipient Worker</span>
                    <div className="col-metrics">
                      <span className="metric-prev">{destinationWorker.assignedPatientsCount || 0}</span>
                      <ArrowRight size={14} color="#64748b" />
                      <span className="metric-next highlight">{destProjected} families</span>
                    </div>
                  </div>
                </div>

                <div className="comparison-footer">
                  <span>Selected for Transfer: <strong>{countToTransfer} families</strong></span>
                </div>
              </div>
            )}

            {/* Transfer Action Button */}
            <div style={{ marginTop: 20 }}>
              <button
                type="button"
                className="btn-auth-primary"
                disabled={!destinationWorkerId || countToTransfer === 0}
                onClick={() => setShowConfirmModal(true)}
              >
                <RefreshCw size={16} />
                <span>Initiate Transfer ({countToTransfer} Families)</span>
              </button>
            </div>
          </div>

          {/* STEP 2: SELECT PATIENT RECORDS TABLE */}
          <div className="redistribution-patients-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 className="form-section-heading" style={{ margin: 0 }}>
                  <Users size={18} />
                  <span>2. Select Patient Families to Transfer ({patients.length})</span>
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Choose individual families or select entire cluster
                </span>
              </div>

              {patients.length > 0 && (
                <button
                  type="button"
                  className="btn-text-action"
                  onClick={handleSelectAll}
                >
                  {selectedPatientIds.length === patients.length ? (
                    <>
                      <CheckSquare size={15} />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square size={15} />
                      <span>Select All ({patients.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {patientsLoading && (
              <div className="supervisor-empty-state">
                <Loader2 size={24} className="animate-spin" color="#059669" />
                <p>Loading patient records assigned to {sourceWorker?.full_name}...</p>
              </div>
            )}

            {!patientsLoading && patients.length === 0 && (
              <div className="supervisor-empty-state">
                <Users size={32} color="#94a3b8" />
                <p>No patient or family registers currently assigned to this worker.</p>
              </div>
            )}

            {!patientsLoading && patients.length > 0 && (
              <div className="patient-selection-list">
                {patients.map((pat) => {
                  const isSelected = selectedPatientIds.includes(pat.patient_id);
                  return (
                    <div
                      key={pat.id}
                      className={`patient-selection-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleTogglePatient(pat.patient_id)}
                    >
                      <div className="checkbox-wrap">
                        {isSelected ? (
                          <CheckSquare size={20} color="#059669" />
                        ) : (
                          <Square size={20} color="#94a3b8" />
                        )}
                      </div>

                      <div className="patient-card-body">
                        <div className="pat-head-name">
                          <strong>{pat.patient_name}</strong>
                          <span className="family-sub">Head: {pat.family_head}</span>
                        </div>

                        <div className="pat-details-line">
                          <span>ID: {pat.patient_id}</span>
                          <span>•</span>
                          <span className="beat-loc">
                            <MapPin size={11} /> {pat.village_beat}
                          </span>
                          <span>•</span>
                          <span className={`risk-tag risk-${(pat.risk_level || 'normal').toLowerCase()}`}>
                            {pat.risk_level || 'Normal'}
                          </span>
                        </div>

                        {pat.condition_summary && (
                          <div className="condition-note">
                            {pat.condition_summary}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          CONFIRMATION MODAL
          ==================================================================== */}
      {showConfirmModal && sourceWorker && destinationWorker && (
        <div className="profile-popup-backdrop" onClick={() => setShowConfirmModal(false)}>
          <div className="supervisor-profile-modal-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px' }}>
                Confirm Caseload Redistribution
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                You are about to transfer <strong>{countToTransfer} patient families</strong> from{' '}
                <strong>{sourceWorker.full_name}</strong> to{' '}
                <strong>{destinationWorker.full_name}</strong>.
              </p>
              <p style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600, marginTop: 8 }}>
                All open pending visits associated with these families will be transferred and logged in SQLite.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button
                type="button"
                className="btn-auth-back"
                style={{ flex: 1 }}
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-auth-primary"
                style={{ flex: 1 }}
                onClick={handleConfirmTransfer}
                disabled={submitting}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                <span>Confirm Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
