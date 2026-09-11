import { AdminUser } from '../../models/AdminUser.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ok } from '../../utils/ApiResponse.js';
import { signAdminToken, setAuthCookie, clearAuthCookie } from '../../utils/tokens.js';
import { writeAuditLog } from '../../utils/audit.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminUser = await AdminUser.findOne({ email }).select('+passwordHash');
  if (!adminUser || !adminUser.active) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await adminUser.comparePassword(password);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  adminUser.lastLoginAt = new Date();
  await adminUser.save();

  const token = signAdminToken(adminUser);
  setAuthCookie(res, token);

  await writeAuditLog({
    actor: adminUser,
    action: 'login',
    module: 'auth',
    entityId: adminUser._id,
  });

  ok(res, { admin: adminUser.toSafeJSON(), token });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  ok(res, { loggedOut: true });
});

export const getCurrentAdmin = asyncHandler(async (req, res) => {
  ok(res, { admin: req.admin.toSafeJSON() });
});
