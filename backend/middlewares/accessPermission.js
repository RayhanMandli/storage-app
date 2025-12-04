import { canAccessUserData } from "../utils/rbac.js";

export const requireDataPermission = (action) => {
    return (req, res, next) => {
        const requester = req.user;
        const targetUserId = req.params.userId;
        console.log(targetUserId , req.user._id)
        const isSelf = requester._id.equals(targetUserId);

        // If user is accessing their own data → always allowed
        if (isSelf) return next();

        if (!canAccessUserData(requester.role, action)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions." });
        }

        next();
    };
};
