export const rolePreferences = {
    owner: 4,
    admin: 3,
    manager: 2,
    user: 1,
};
export const roleChangeMap = {
    owner: ["admin", "manager", "user"],
    admin: ["admin", "manager", "user"],
    manager: ["manager", "user"],
};
export const dataAccessRules = {
    owner: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canCreate: true,
    },
    admin: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canCreate: false,
    },
    manager: {
        canView: false,
        canEdit: false,
        canDelete: false,
        canCreate: false,
    },
    user: {
        canView: false,
        canEdit: false,
        canDelete: false,
        canCreate: false,
    },
};

export function canAccessUserData(requesterRole, action) {
    const role = dataAccessRules[requesterRole];
    if (!role) return false;
    return role[action] === true;
}
export function canChangeRole(requesterRole, targetRole, newRole) {
    // 1. Cannot downgrade or upgrade someone equal or higher than you
    if (rolePreferences[requesterRole] <= rolePreferences[targetRole]) {
        return {
            allowed: false,
            message:
                "Forbidden: Cannot modify users with equal or higher role.",
        };
    }

    // 2. Cannot assign a role higher than allowed
    const allowedRoles = roleChangeMap[requesterRole] || [];

    if (!allowedRoles.includes(newRole)) {
        return {
            allowed: false,
            message:
                "Forbidden: You do not have permission to assign this role.",
        };
    }

    return { allowed: true };
}
