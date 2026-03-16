import { createClient } from '@supabase/supabase-js';
import type { Express, RequestHandler } from 'express';
import { storage } from './storage';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function setupAuth(app: Express) {
  // Auth is handled client-side with Supabase Auth.
  // This endpoint just clears server state on logout (client handles Supabase signOut).
  app.post('/api/logout', (_req, res) => {
    res.json({ success: true });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Ensure user exists in our database (auto-create on first request)
  await storage.upsertUser({
    id: user.id,
    email: user.email ?? undefined,
  });

  (req as any).user = { id: user.id, email: user.email };
  next();
};
