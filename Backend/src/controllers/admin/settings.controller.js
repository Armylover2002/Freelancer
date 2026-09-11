import { SiteSettings } from '../../models/SiteSettings.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/ApiResponse.js';
import { writeAuditLog } from '../../utils/audit.js';

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({ singletonKey: 'main' });
  if (!settings) settings = await SiteSettings.create({});
  ok(res, settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({ singletonKey: 'main' });
  if (!settings) settings = new SiteSettings({});
  const before = settings.toObject();

  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
      settings[key] = { ...settings[key]?.toObject?.() ?? settings[key], ...req.body[key] };
    } else {
      settings[key] = req.body[key];
    }
  }
  await settings.save();

  await writeAuditLog({
    actor: req.admin,
    action: 'update',
    module: 'settings',
    entityId: settings._id,
    before,
    after: settings.toObject(),
  });

  ok(res, settings);
});
