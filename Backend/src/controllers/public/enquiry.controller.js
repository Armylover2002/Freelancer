import crypto from 'node:crypto';
import { Enquiry } from '../../models/Enquiry.js';
import { SiteSettings } from '../../models/SiteSettings.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { created } from '../../utils/ApiResponse.js';
import { sendEmailSafe } from '../../utils/sendEmail.js';
import { env } from '../../config/env.js';
import { uploadBufferToCloudinary, isCloudinaryConfigured } from '../../config/cloudinary.js';
import { logger } from '../../utils/logger.js';

function hashIp(ip) {
  if (!ip) return undefined;
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export const createEnquiry = asyncHandler(async (req, res) => {
  const body = req.body;

  // Honeypot: a real visitor never fills this hidden field. Silently accept but don't persist real spam.
  if (body.website) {
    return created(res, { accepted: true });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

  // Save to MongoDB FIRST - the enquiry must not disappear if email delivery fails afterwards.
  const enquiry = await Enquiry.create({
    contact: body.contact,
    business: body.business,
    projectType: body.projectType,
    pages: body.pages,
    features: body.features,
    design: body.design,
    budgetRange: body.budgetRange,
    timeline: body.timeline,
    brief: body.brief,
    heardFrom: body.heardFrom,
    consent: body.consent,
    files: body.files,
    source: {
      ...body.source,
      referrer: req.headers.referer || body.source?.referrer,
      userAgent: req.headers['user-agent'],
      ipHash: hashIp(clientIp),
    },
    activity: [
      {
        type: 'created',
        toStatus: 'NEW',
        message: 'Enquiry submitted via website',
      },
    ],
  });

  // Notification email is best-effort and must never block/rollback the enquiry.
  (async () => {
    const settings = await SiteSettings.findOne({ singletonKey: 'main' }).lean();
    const notifyTo = env.email.adminNotificationEmail;
    if (notifyTo) {
      const result = await sendEmailSafe({
        to: notifyTo,
        subject: `New project enquiry: ${enquiry.contact.name} (${enquiry.projectType})`,
        html: `<p>New enquiry received from <b>${enquiry.contact.name}</b> (${enquiry.contact.email}, ${enquiry.contact.phone}).</p>
               <p>Project type: ${enquiry.projectType}<br/>Budget: ${enquiry.budgetRange}<br/>Timeline: ${enquiry.timeline}</p>
               <p>Brief: ${enquiry.brief || '-'}</p>`,
      });
      enquiry.notification.adminEmailSent = result.sent;
      enquiry.notification.providerMessageId = result.messageId;
    }

    if (enquiry.contact.email) {
      await sendEmailSafe({
        to: enquiry.contact.email,
        subject: `${settings?.branding?.agencyName || 'Our team'} received your project request`,
        html: `<p>Hi ${enquiry.contact.name},</p><p>${
          settings?.enquiryConfirmationMessage ||
          "Thanks! Your project request has been received. We'll review your requirements and contact you soon."
        }</p>`,
      }).then((r) => {
        enquiry.notification.clientEmailSent = r.sent;
      });
    }
    await enquiry.save().catch((e) => logger.error(`Failed saving notification status: ${e.message}`));
  })().catch((e) => logger.error(`Enquiry notification pipeline failed: ${e.message}`));

  const settings = await SiteSettings.findOne({ singletonKey: 'main' }).lean();

  created(res, {
    id: enquiry._id,
    message:
      settings?.enquiryConfirmationMessage ||
      "Thanks! Your project request has been received. We'll review your requirements and contact you within 24-48 business hours.",
  });
});

/**
 * Public, rate-limited upload used only during the "Start Your Project" flow
 * (brand/reference assets attached to an enquiry before it is submitted).
 */
export const uploadEnquiryFile = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured) throw ApiError.internal('Media storage is not configured');
  if (!req.file) throw ApiError.badRequest('No file provided');

  const result = await uploadBufferToCloudinary(req.file.buffer, { folder: 'agency/enquiries' });

  created(res, {
    url: result.secure_url,
    publicId: result.public_id,
    originalName: req.file.originalname,
    format: result.format,
    bytes: result.bytes,
  });
});
