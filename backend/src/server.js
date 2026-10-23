import { assertRequiredEnv, env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import app from "./app.js";

assertRequiredEnv();

try {
  await connectDb();
  app.listen(env.PORT, () => {
    console.log(`GiveHope API listening on http://localhost:${env.PORT}/api`);
  });
} catch (err) {
  console.error("Failed to start server:", err.message);
  process.exit(1);
}
