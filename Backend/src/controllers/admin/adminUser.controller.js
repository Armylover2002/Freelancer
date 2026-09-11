import { AdminUser } from '../../models/AdminUser.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ok, created } from '../../utils/ApiResponse.js';
import { writeAuditLog } from '../../utils/audit.js';

export const listAdminUsers = asyncHandler(async (req, res) => {
  const users = await AdminUser.find({}).sort({ createdAt: -1 }).lean();
  ok(res, users.map((u) => ({ ...u, passwordHash: undefined })));
});

export const inviteAdminUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await AdminUser.findOne({ email });
  if (existing) throw ApiError.conflict('An admin with this email already exists');

  const passwordHash = await AdminUser.hashPassword(password);
  const user = await AdminUser.create({ name, email, passwordHash, role });

  await writeAuditLog({
    actor: req.admin,
    action: 'create',
    module: 'adminUsers',
    entityId: user._id,
    after: { name, email, role },
  });

  created(res, user.toSafeJSON());
});

export const updateAdminUser = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.params.id);
  if (!user) throw ApiError.notFound('Admin user not found');

  if (user.role === 'owner' && req.body.role && req.body.role !== 'owner' && req.admin.role !== 'owner') {
    throw ApiError.forbidden('Only an owner can change another owner');
  }

  const before = { name: user.name, role: user.role, active: user.active };

  if (req.body.name) user.name = req.body.name;
  if (req.body.role) user.role = req.body.role;
  if (req.body.active !== undefined) user.active = req.body.active;
  if (req.body.password) user.passwordHash = await AdminUser.hashPassword(req.body.password);

  await user.save();

  await writeAuditLog({
    actor: req.admin,
    action: 'update',
    module: 'adminUsers',
    entityId: user._id,
    before,
    after: { name: user.name, role: user.role, active: user.active },
  });

  ok(res, user.toSafeJSON());
});

export const deactivateAdminUser = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.params.id);
  if (!user) throw ApiError.notFound('Admin user not found');
  if (String(user._id) === String(req.admin._id)) {
    throw ApiError.badRequest('You cannot deactivate your own account');
  }

  user.active = false;
  await user.save();

  await writeAuditLog({
    actor: req.admin,
    action: 'deactivate',
    module: 'adminUsers',
    entityId: user._id,
  });

  ok(res, { deactivated: true });
});
