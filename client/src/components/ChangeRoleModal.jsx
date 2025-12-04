import { useState } from 'react';
import './ChangeRoleModal.css';

export default function ChangeRoleModal({
  open,
  userName,
  currentRole,
  onConfirm,
  onCancel,
  isLoading = false
}) {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  if (!open) return null;

  const roles = ['admin', 'manager', 'owner', 'user'];

  const handleConfirm = () => {
    if (selectedRole !== currentRole) {
      onConfirm(selectedRole);
    } else {
      onCancel();
    }
  };

  return (
    <div className="change-role-overlay">
      <div className="change-role-content">
        <h2 className="change-role-title">Change User Role</h2>
        
        <div className="change-role-body">
          <div className="change-role-user-info">
            <p className="change-role-label">User:</p>
            <p className="change-role-username">{userName}</p>
          </div>

          <div className="change-role-current">
            <p className="change-role-label">Current Role:</p>
            <p className="change-role-current-role">{currentRole}</p>
          </div>

          <div className="change-role-dropdown-group">
            <label htmlFor="role-select" className="change-role-label">
              Select New Role:
            </label>
            <select
              id="role-select"
              className="change-role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={isLoading}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="change-role-actions">
          <button
            onClick={onCancel}
            className="change-role-cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="change-role-confirm-btn"
            disabled={isLoading || selectedRole === currentRole}
          >
            {isLoading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
