import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { batchRouter } from "./routes/batch.js";
import { feeRouter } from "./routes/fee.js";
import { healthRouter } from "./routes/health.js";
import { taasisiRouter } from "./routes/taasisi.js";
import { usersRouter } from "./routes/users.js";
import { wanafunziRouter } from "./routes/wanafunzi.js";

export function createApp() {
  const app = express();
  const allowedOrigins = (
    process.env.CLIENT_ORIGIN ?? "http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.use(healthRouter);
  app.use(taasisiRouter);
  app.use(batchRouter);
  app.use(wanafunziRouter);
  app.use(feeRouter);
  app.use(usersRouter);
  app.use(authRouter);

  return app;
}
