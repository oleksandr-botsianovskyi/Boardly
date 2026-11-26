import { AuthUser } from './auth-user.js';
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: AuthUser;
};
