import { AdminUser } from '../models/AdminUser.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/tokens.js';
import { env } from '../config/env.js';

/**
 * Verifies the admin session token (httpOnly cookie, falls back to Bearer header for tooling)
 * and loads the current admin profile from MongoDB. Never trusts a role sent from the client.
 */
export const requireAdmin = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.[env.jwtCookieName] ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) throw ApiError.unauthorized('Authentication required');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired session');
  }

  const adminUser = await AdminUser.findById(payload.sub);
  if (!adminUser || !adminUser.active) {
    throw ApiError.unauthorized('Account not found or deactivated');
  }

  req.admin = adminUser;
  next();
});

/**
 * Role gate. Usage: requireRole('owner') or requireRole('owner', 'admin').
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin) return next(ApiError.unauthorized());
    if (!roles.includes(req.admin.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
}
