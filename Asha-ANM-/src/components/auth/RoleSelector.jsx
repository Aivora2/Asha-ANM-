import React from 'react';
import { Shield, UserCheck, Users } from 'lucide-react';

/**
 * Three-role selector tab bar with responsive hover color themes:
 * - Supervisor / Admin -> Light Green & Dark Green
 * - ASHA Worker -> Purple & Pink
 * - User -> Blue & Yellow
 */
export const RoleSelector = ({ selectedRole, onSelectRole, onHoverRole }) => {
  return (
    <div className="role-tabs-wrapper">
      <span className="role-tabs-label">Select Portal Role</span>
      <div 
        className="role-tabs-list" 
        onMouseLeave={() => onHoverRole(null)}
      >
        {/* 1. Supervisor / Admin (Green Theme) */}
        <button
          type="button"
          className={`role-tab-btn role-supervisor ${selectedRole === 'SUPERVISOR' ? 'active' : ''}`}
          onClick={() => onSelectRole('SUPERVISOR')}
          onMouseEnter={() => onHoverRole('supervisor')}
          title="Supervisor / Administrative Health Portal"
        >
          <div className="role-icon-box">
            <Shield size={16} />
          </div>
          <span>Supervisor / Admin</span>
        </button>

        {/* 2. ASHA Worker (Purple / Pink Theme) */}
        <button
          type="button"
          className={`role-tab-btn role-asha ${selectedRole === 'ASHA' ? 'active' : ''}`}
          onClick={() => onSelectRole('ASHA')}
          onMouseEnter={() => onHoverRole('asha')}
          title="ASHA / ANM Field Worker Portal"
        >
          <div className="role-icon-box">
            <UserCheck size={16} />
          </div>
          <span>ASHA Worker</span>
        </button>

        {/* 3. User / Citizen (Blue / Yellow Theme) */}
        <button
          type="button"
          className={`role-tab-btn role-user ${selectedRole === 'USER' ? 'active' : ''}`}
          onClick={() => onSelectRole('USER')}
          onMouseEnter={() => onHoverRole('user')}
          title="Citizen & Beneficiary Portal (ASHA Registered)"
        >
          <div className="role-icon-box">
            <Users size={16} />
          </div>
          <span>User / Citizen</span>
        </button>
      </div>
    </div>
  );
};
