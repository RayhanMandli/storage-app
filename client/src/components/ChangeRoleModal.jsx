import { useEffect, useState } from 'react';

export default function ChangeRoleModal({
  open,
  userName,
  currentRole,
  onConfirm,
  onCancel,
  isLoading = false,
  roleChangeError = null
}) {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole]);

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
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center">
      <div className="w-[420px] max-w-full rounded-xl bg-white shadow-2xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">Change User Role</h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-700">User:</p>
            <p className="text-base font-medium text-gray-900">{userName}</p>
          </div>

          <div className="bg-gray-100 rounded-lg px-3 py-2">
            <p className="text-sm font-semibold text-gray-700">Current Role:</p>
            <p className="text-base font-medium text-gray-900">{currentRole}</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="role-select" className="text-sm font-semibold text-gray-700">
              Select New Role:
            </label>
            <select
              id="role-select"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {roleChangeError && (
              <p className="text-sm text-red-600">{roleChangeError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="h-10 px-4 rounded bg-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="h-10 px-4 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isLoading || selectedRole === currentRole}
          >
            {isLoading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
