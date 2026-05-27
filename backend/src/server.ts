import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { config } from "./config";
import buildAiRoutes from "./routes/buildAiRoutes";
import { HttpError } from "./utils/httpErrors";

const app = express();

app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mdfmt-backend" });
});

app.use("/api/build-ai", buildAiRoutes);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Route not found."));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Unexpected server error.";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({ error: message });
});

app.listen(config.port, () => {
  console.log(`mdfmt backend listening on http://localhost:${config.port}`);
});
