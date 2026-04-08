import { rateLimit } from "express-rate-limit";
const throttleStore = {};
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    skip: (req) => {
    return (
      req.path === "/auth/logout" ||
      req.path === "/auth/all-logout"
    );
  },
});
export const sensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});
export function throttle({ delayMs, windowSize }) {
    return function (req, res, next) {
        if (throttleStore[req.ip] === undefined) {
            throttleStore[req.ip] = {
                count: 0,
                timer: Date.now() + windowSize,
            };
            return next();
        } else {
            if (Date.now() > throttleStore[req.ip].timer) {
                throttleStore[req.ip] = {
                    count: 0,
                    timer: Date.now() + windowSize,
                };
                return next();
            }
            throttleStore[req.ip].count += 1;
            const delay = throttleStore[req.ip].count * delayMs;
            setTimeout(() => {
                next();
            }, delay);
        }
    };
}
