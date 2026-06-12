import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { matchesRouter } from "./routes/matches.js";
import { oddsRouter } from "./routes/odds.js";
import { betsRouter } from "./routes/bets.js";
import { aiTipsRouter } from "./routes/aiTips.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Prisma nem elérhető — a DB-függő route-ok (auth, matches, odds, bets)
// jelenleg "not yet implemented" állapotban vannak. Az aiTips route nem
// igényel adatbázist.
const prisma = null;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    prisma: prisma !== null,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/odds", oddsRouter);
app.use("/api/bets", betsRouter);
app.use("/api/ai", aiTipsRouter);

// ─── Error handling ─────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`⚡ BETVISION API running on http://localhost:${PORT}`);
  if (prisma) {
    console.log(`📦 Prisma connected — datasource: postgresql`);
  } else {
    console.log(`📭 DB mód: offline (aiTips route elérhető, DB route-ok nem)`);
  }
});

export { app, prisma };
