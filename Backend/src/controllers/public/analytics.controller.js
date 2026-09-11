import { AnalyticsEvent } from '../../models/AnalyticsEvent.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { created } from '../../utils/ApiResponse.js';

export const recordAnalyticsEvent = asyncHandler(async (req, res) => {
  const body = req.body;
  await AnalyticsEvent.create({
    type: body.type,
    path: body.path,
    referrer: body.referrer,
    utm: body.utm,
    device: body.device,
    sessionId: body.sessionId,
    meta: body.meta,
  });
  created(res, { recorded: true });
});
