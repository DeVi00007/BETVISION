import { Router, Request, Response } from "express";

export const oddsRouter = Router();

// GET /api/odds/:matchId — odds for a specific match
oddsRouter.get("/:matchId", (req: Request, res: Response) => {
  res.json({ message: `GET /api/odds/${req.params.matchId} — not yet implemented` });
});
