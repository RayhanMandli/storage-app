import { File } from "../models/fileModel.js";
import { canAccessUserData } from "../utils/rbac.js";

export const requireDataPermission = (action) => {
    return async (req, res, next) => {
        const requester = req.user;
        const file = await File.findById(req.params.id);
        const allowed = canAccessUserData(requester, action, file);

        if (!allowed) {
            return res
                .status(403)
                .json({ error: "Forbidden: Insufficient permissions." });
        }

        next();
    };
};
