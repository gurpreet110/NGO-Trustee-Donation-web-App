import rateLimit from "express-rate-limit";

function jsonHandler(message) {
  return (req, res, _next, _options) => {
    res.status(429).json({ message });
  };
}

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health" || req.originalUrl === "/api/health",
  handler: jsonHandler("Too many requests, please try again later."),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler("Too many authentication attempts, please try again later."),
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler("Too many contact submissions, please try again later."),
});
