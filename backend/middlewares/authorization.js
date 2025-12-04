export function isAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
}
export function isOwner(req, res, next) {
    if (req.user.role !== "owner") {
        return res.status(403).json({ error: "Forbidden: Owners only" });
    }
    next();
}
export function isAuthority(req, res, next) {
    if (req.user.role === "user") {
        return res
            .status(403)
            .json({ error: "Forbidden: Authorized person only" });
    }
    next();
}
export function isHigherAuthority(req, res, next) {
    if (req.user.role === "user" || req.user.role === "manager") {
        return res
            .status(403)
            .json({ error: "Forbidden: Authorized person only" });
    }
    next();
}
