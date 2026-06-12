import { Router, Request, Response } from "express";

export const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", (_req: Request, res: Response) => {
  res.json({ message: "POST /api/auth/register — not yet implemented" });
});

// POST /api/auth/login
authRouter.post("/login", (_req: Request, res: Response) => {
  res.json({ message: "POST /api/auth/login — not yet implemented" });
});

// GET /api/auth/me
authRouter.get("/me", (_req: Request, res: Response) => {
  res.json({ message: "GET /api/auth/me — not yet implemented" });
});
