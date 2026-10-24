import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dns from "node:dns";
import mongoSanitize from "express-mongo-sanitize";
import { clientOrigins, env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiters.js";
import apiRouter from "./routes/index.js";

const app = express();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        if (
          clientOrigins.includes(origin) ||
          clientOrigins.includes("*") ||
          url.hostname.endsWith(".netlify.app") ||
          url.hostname.endsWith(".vercel.app") ||
          url.hostname === "localhost" ||
          url.hostname === "127.0.0.1"
        ) {
          return callback(null, true);
        }
      } catch {
        // invalid origin url format
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "GiveHope NGO API is running",
    endpoints: {
      campaigns: "/api/campaigns",
      trustees: "/api/trustees",
      donationInquiries: "/api/donation-inquiries",
    },
  });
});

app.use("/api", apiRouter);
app.use("/api", notFoundHandler);
app.use(errorHandler);

export default app;
