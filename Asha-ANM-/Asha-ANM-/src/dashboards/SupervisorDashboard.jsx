import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  MapPin, 
  Award, 
  RefreshCw, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { AddWorkerTab } from '../components/supervisor/AddWorkerTab';
import { WorkerListTab } from '../components/supervisor/WorkerListTab';
import { WorkerAssignmentTab } from '../components/supervisor/WorkerAssignmentTab';
import { WorkerPerformanceTab } from '../components/supervisor/WorkerPerformanceTab';
import { WorkerRedistributionTab } from '../components/supervisor/WorkerRedistributionTab';
import '../styles/supervisor-dashboard.css';

/**
 * 6 Navigation Tabs in Exact Required Order:
 * 1. Dashboard Overview / Home (default)
 * 2. Add ASHA Worker
 * 3. ASHA/ANM Worker List
 * 4. Area-wise Worker Assignment
 * 5. Worker Performance
 * 6. Worker Redistribution
 */
const DASHBOARD_TABS = [
  { id: 'overview', label: 'Dashboard Overview / Home', icon: LayoutDashboard },
  { id: 'add-worker', label: 'Add ASHA Worker', icon: UserPlus },
  { id: 'worker-list', label: 'ASHA/ANM Worker List', icon: Users },
  { id: 'worker-assignment', label: 'Area-wise Worker Assignment', icon: MapPin },
  { id: 'worker-performance', label: 'Worker Performance', icon: Award },
  { id: 'worker-redistribution', label: 'Worker Redistribution', icon: RefreshCw },
];

export const SupervisorDashboard = () => {
  const { user, supervisorProfilePopupOpen } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Authenticated supervisor attributes with safe factual fallbacks
  const officerName = user?.fullName || user?.name || 'Dr. Rajesh Verma';
  const supervisorId = user?.supervisorId || 'SUPJPR0247';
  const designation = user?.designation || 'Medical Officer In-Charge (MOIC)';
  const assignedArea = user?.assignedArea || user?.area || 'Sitapura Block';
  const facilityName = user?.facilityName || 'PHC Beelwa, Sitapura';
  const department = user?.department || 'Dept. of Health & Family Welfare';

  // Get current active tab metadata
  const currentTabMeta = DASHBOARD_TABS.find(t => t.id === activeTab) || DASHBOARD_TABS[0];

  return (
    <div className={`supervisor-dashboard-shell ${supervisorProfilePopupOpen ? 'dashboard-blurred' : ''}`}>
      <div className="supervisor-dashboard-container">
        
        {/* ==================================================================
            1. HERO OVERVIEW / HOME BANNER (Uses Generated Hero Image)
            ================================================================== */}
        <section className="supervisor-hero-banner" aria-label="Supervisor Overview Banner">
          {/* Background image: High-res Indian clinical coordination scene */}
          <img 
            src="/images/supervisor-dashboard-hero.jpg" 
            alt="Community healthcare coordination at Ayushman Bharat PHC" 
            className="supervisor-hero-bg-img"
          />

          {/* Layered depth overlay with soft emerald gradients */}
          <div className="supervisor-hero-overlay" />

          {/* Foreground content with glassmorphism and clear contrast */}
          <div className="supervisor-hero-content">
            <div className="supervisor-hero-header-row">
              <div>
                <div className="supervisor-hero-badge-pill">
                  <ShieldCheck size={14} />
                  <span>Ayushman Bharat • Primary Health Centre</span>
                </div>
                <h1 className="supervisor-hero-title">
                  Welcome, {officerName}
                </h1>
                <p className="supervisor-hero-subtitle">
                  {designation} • {assignedArea} & {facilityName}
                </p>
              </div>

              <div className="supervisor-hero-status-pill">
                <span className="supervisor-hero-status-dot" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Active Supervision Session
                </span>
              </div>
            </div>

            {/* Factual Officer Credentials Strip (NO fabricated operational statistics) */}
            <div className="supervisor-hero-data-strip">
              <div className="supervisor-hero-data-card">
                <div className="supervisor-hero-data-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="supervisor-hero-data-label">Official Supervisor ID</div>
                  <div className="supervisor-hero-data-val" style={{ fontFamily: 'monospace' }}>
                    {supervisorId}
                  </div>
                </div>
              </div>

              <div className="supervisor-hero-data-card">
                <div className="supervisor-hero-data-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="supervisor-hero-data-label">Administrative Beat</div>
                  <div className="supervisor-hero-data-val">
                    {assignedArea}
                  </div>
                </div>
              </div>

              <div className="supervisor-hero-data-card">
                <div className="supervisor-hero-data-icon">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="supervisor-hero-data-label">Health Facility Base</div>
                  <div className="supervisor-hero-data-val">
                    {facilityName}
                  </div>
                </div>
              </div>

              <div className="supervisor-hero-data-card">
                <div className="supervisor-hero-data-icon">
                  <Info size={20} />
                </div>
                <div>
                  <div className="supervisor-hero-data-label">Governing Department</div>
                  <div className="supervisor-hero-data-val" style={{ fontSize: '0.85rem' }}>
                    {department}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            2. PRIMARY TAB NAVIGATION (6 Tabs in Exact Required Order)
            ================================================================== */}
        <nav className="supervisor-tabs-nav-wrapper" aria-label="Dashboard Module Tabs">
          <div className="supervisor-tabs-list">
            {DASHBOARD_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`supervisor-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-selected={isActive}
                  role="tab"
                >
                  <TabIcon size={18} className="supervisor-tab-icon" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ==================================================================
            3. TAB CONTENT VIEWS
            ================================================================== */}

        {/* TAB 1: DASHBOARD OVERVIEW / HOME */}
        {activeTab === 'overview' && (
          <section className="supervisor-overview-section" aria-label="Workforce Administration Modules">
            <div className="supervisor-section-intro">
              <div>
                <h2 className="supervisor-section-title">
                  <Sparkles size={20} color="#059669" />
                  <span>Workforce Administration & Field Operations</span>
                </h2>
                <p className="supervisor-section-desc">
                  Select an administrative module below or use the navigation tabs above to manage ASHA and ANM field personnel.
                </p>
              </div>
            </div>

            {/* 5 Clean Module Gateway Cards matching the 5 tabs */}
            <div className="supervisor-modules-grid">
              
              {/* Module 1: Add ASHA Worker */}
              <div className="supervisor-module-card">
                <div className="supervisor-module-card-top">
                  <div className="supervisor-module-icon-box">
                    <UserPlus size={24} />
                  </div>
                  <span className="supervisor-module-badge">Module 1</span>
                </div>
                <h3 className="supervisor-module-title">Add ASHA Worker</h3>
                <p className="supervisor-module-desc">
                  Onboard newly recruited community health workers, allocate official identification, and assign initial beat sectors.
                </p>
                <button 
                  type="button" 
                  className="supervisor-module-btn"
                  onClick={() => setActiveTab('add-worker')}
                >
                  <span>Open Tab</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Module 2: ASHA/ANM Worker List */}
              <div className="supervisor-module-card">
                <div className="supervisor-module-card-top">
                  <div className="supervisor-module-icon-box">
                    <Users size={24} />
                  </div>
                  <span className="supervisor-module-badge">Module 2</span>
                </div>
                <h3 className="supervisor-module-title">ASHA/ANM Worker List</h3>
                <p className="supervisor-module-desc">
                  View the active registry of field workers, contact directories, qualification records, and operational deployment statuses.
                </p>
                <button 
                  type="button" 
                  className="supervisor-module-btn"
                  onClick={() => setActiveTab('worker-list')}
                >
                  <span>Open Tab</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Module 3: Area-wise Worker Assignment */}
              <div className="supervisor-module-card">
                <div className="supervisor-module-card-top">
                  <div className="supervisor-module-icon-box">
                    <MapPin size={24} />
                  </div>
                  <span className="supervisor-module-badge">Module 3</span>
                </div>
                <h3 className="supervisor-module-title">Area-wise Worker Assignment</h3>
                <p className="supervisor-module-desc">
                  Coordinate beat boundaries, village cluster assignments, sub-centre allocations, and population coverage quotas.
                </p>
                <button 
                  type="button" 
                  className="supervisor-module-btn"
                  onClick={() => setActiveTab('worker-assignment')}
                >
                  <span>Open Tab</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Module 4: Worker Performance */}
              <div className="supervisor-module-card">
                <div className="supervisor-module-card-top">
                  <div className="supervisor-module-icon-box">
                    <Award size={24} />
                  </div>
                  <span className="supervisor-module-badge">Module 4</span>
                </div>
                <h3 className="supervisor-module-title">Worker Performance</h3>
                <p className="supervisor-module-desc">
                  Supervise maternal-infant visit adherence, immunization schedule compliance, and follow-up response timeliness.
                </p>
                <button 
                  type="button" 
                  className="supervisor-module-btn"
                  onClick={() => setActiveTab('worker-performance')}
                >
                  <span>Open Tab</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Module 5: Worker Redistribution */}
              <div className="supervisor-module-card">
                <div className="supervisor-module-card-top">
                  <div className="supervisor-module-icon-box">
                    <RefreshCw size={24} />
                  </div>
                  <span className="supervisor-module-badge">Module 5</span>
                </div>
                <h3 className="supervisor-module-title">Worker Redistribution</h3>
                <p className="supervisor-module-desc">
                  Rebalance uneven caseloads between beats, reassign temporary coverages during leave, and resolve field capacity constraints.
                </p>
                <button 
                  type="button" 
                  className="supervisor-module-btn"
                  onClick={() => setActiveTab('worker-redistribution')}
                >
                  <span>Open Tab</span>
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>
          </section>
        )}

        {/* TAB 2: ADD ASHA WORKER */}
        {activeTab === 'add-worker' && (
          <AddWorkerTab 
            onWorkerAdded={() => {}}
            onNavigateToList={() => setActiveTab('worker-list')}
          />
        )}

        {/* TAB 3: ASHA/ANM WORKER LIST */}
        {activeTab === 'worker-list' && (
          <WorkerListTab 
            onNavigateToAddWorker={() => setActiveTab('add-worker')}
          />
        )}

        {/* TAB 4: AREA-WISE WORKER ASSIGNMENT */}
        {activeTab === 'worker-assignment' && (
          <WorkerAssignmentTab />
        )}

        {/* TAB 5: WORKER PERFORMANCE */}
        {activeTab === 'worker-performance' && (
          <WorkerPerformanceTab />
        )}

        {/* TAB 6: WORKER REDISTRIBUTION */}
        {activeTab === 'worker-redistribution' && (
          <WorkerRedistributionTab />
        )}

      </div>
    </div>
  );
};
