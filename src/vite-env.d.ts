/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * A backend Express motor base URL-je (/api/ai/* végpontok).
   *
   * - DEV: hagyd ÜRESEN — a vite.config.ts proxyzza a /api/ai-t a
   *   localhost:4000-re, így a relatív út működik.
   * - PROD (Vercel): ha az Express motor külön domainen/szolgáltatáson fut
   *   (pl. Railway, Render, Fly.io), add meg a teljes URL-t végződő / nélkül,
   *   pl. "https://betvision-api.up.railway.app".
   *   Ha a backend nem elérhető, a frontend statikus pillanatképre fallbackel.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
