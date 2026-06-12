import { Router, Request, Response } from "express";

export const betsRouter = Router();

// POST /api/bets — place a new bet
betsRouter.post("/", (_req: Request, res: Response) => {
  res.json({ message: "POST /api/bets — not yet implemented" });
});

// GET /api/bets — list user's bets
betsRouter.get("/", (_req: Request, res: Response) => {
  res.json({ message: "GET /api/bets — not yet implemented" });
});

// GET /api/bets/:id — single bet details
betsRouter.get("/:id", (req: Request, res: Response) => {
  res.json({ message: `GET /api/bets/${req.params.id} — not yet implemented` });
});
