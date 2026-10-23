import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import { clientOrigins, env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiters.js";
import apiRouter from "./routes/index.js";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || clientOrigins.includes(origin)) {
        return callback(null, true);
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

app.use("/api", apiRouter);
app.use("/api", notFoundHandler);
app.use(errorHandler);

export default app;
