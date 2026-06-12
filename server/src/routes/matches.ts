import { Router, Request, Response } from "express";

export const matchesRouter = Router();

// GET /api/matches — list all matches (with optional filters)
matchesRouter.get("/", (_req: Request, res: Response) => {
  res.json({ message: "GET /api/matches — not yet implemented" });
});

// GET /api/matches/:id — single match with odds
matchesRouter.get("/:id", (req: Request, res: Response) => {
  res.json({ message: `GET /api/matches/${req.params.id} — not yet implemented` });
});
