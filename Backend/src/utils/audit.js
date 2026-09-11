import { AuditLog } from '../models/AuditLog.js';
import { logger } from './logger.js';

/**
 * Records an admin action. Failures are logged but never thrown - audit logging
 * must not break the primary operation it is describing.
 */
export async function writeAuditLog({ actor, action, module, entityId, before, after, metadata }) {
  try {
    await AuditLog.create({
      actor: actor?._id,
      actorName: actor?.name,
      action,
      module,
      entityId,
      before,
      after,
      metadata,
    });
  } catch (err) {
    logger.error(`Failed to write audit log (${module}/${action}): ${err.message}`);
  }
}
