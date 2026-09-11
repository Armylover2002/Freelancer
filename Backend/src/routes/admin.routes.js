import { Router } from 'express';
import { requireAdmin, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadImage } from '../middleware/upload.js';

import { getDashboard } from '../controllers/admin/dashboard.controller.js';
import {
  listEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  addEnquiryNote,
  updateEnquiry,
  exportEnquiriesCsv,
} from '../controllers/admin/enquiry.controller.js';
import { projectCrud } from '../controllers/admin/project.controller.js';
import { serviceCrud } from '../controllers/admin/service.controller.js';
import { pricingCrud } from '../controllers/admin/pricing.controller.js';
import { teamCrud } from '../controllers/admin/team.controller.js';
import { testimonialCrud } from '../controllers/admin/testimonial.controller.js';
import { faqCrud } from '../controllers/admin/faq.controller.js';
import { listMedia, uploadMedia, updateMedia, deleteMedia } from '../controllers/admin/media.controller.js';
import { getSettings, updateSettings } from '../controllers/admin/settings.controller.js';
import {
  listAdminUsers,
  inviteAdminUser,
  updateAdminUser,
  deactivateAdminUser,
} from '../controllers/admin/adminUser.controller.js';
import { listAuditLogs } from '../controllers/admin/auditLog.controller.js';
import { listClients, getClient, addClientNote, updateClientStatus } from '../controllers/admin/client.controller.js';

import { projectSchema, updateProjectSchema } from '../validators/project.validator.js';
import { serviceSchema, updateServiceSchema } from '../validators/service.validator.js';
import { pricingPlanSchema, updatePricingPlanSchema } from '../validators/pricing.validator.js';
import { teamMemberSchema, updateTeamMemberSchema } from '../validators/team.validator.js';
import { testimonialSchema, updateTestimonialSchema } from '../validators/testimonial.validator.js';
import { faqSchema, updateFaqSchema } from '../validators/faq.validator.js';
import { siteSettingsSchema } from '../validators/settings.validator.js';
import { createAdminUserSchema, updateAdminUserSchema } from '../validators/auth.validator.js';
import {
  updateEnquiryStatusSchema,
  addEnquiryNoteSchema,
  updateEnquirySchema,
} from '../validators/enquiry.validator.js';

const router = Router();

// Every route below requires a valid admin session. Frontend guards are cosmetic only.
router.use(requireAdmin);

router.get('/dashboard', getDashboard);

// Enquiries / lead pipeline
router.get('/enquiries', listEnquiries);
router.get('/enquiries/export.csv', exportEnquiriesCsv);
router.get('/enquiries/:id', getEnquiry);
router.patch('/enquiries/:id/status', validate(updateEnquiryStatusSchema), updateEnquiryStatus);
router.post('/enquiries/:id/notes', validate(addEnquiryNoteSchema), addEnquiryNote);
router.patch('/enquiries/:id', validate(updateEnquirySchema), updateEnquiry);

// Clients
router.get('/clients', listClients);
router.get('/clients/:id', getClient);
router.post('/clients/:id/notes', addClientNote);
router.patch('/clients/:id/status', updateClientStatus);

// Projects
router.get('/projects', projectCrud.list);
router.get('/projects/:id', projectCrud.getById);
router.post('/projects', validate(projectSchema), projectCrud.create);
router.patch('/projects/:id', validate(updateProjectSchema), projectCrud.update);
router.delete('/projects/:id', requireRole('owner', 'admin'), projectCrud.remove);

// Services
router.get('/services', serviceCrud.list);
router.get('/services/:id', serviceCrud.getById);
router.post('/services', validate(serviceSchema), serviceCrud.create);
router.patch('/services/:id', validate(updateServiceSchema), serviceCrud.update);
router.delete('/services/:id', requireRole('owner', 'admin'), serviceCrud.remove);

// Pricing
router.get('/pricing', pricingCrud.list);
router.get('/pricing/:id', pricingCrud.getById);
router.post('/pricing', validate(pricingPlanSchema), pricingCrud.create);
router.patch('/pricing/:id', validate(updatePricingPlanSchema), pricingCrud.update);
router.delete('/pricing/:id', requireRole('owner', 'admin'), pricingCrud.remove);

// Team
router.get('/team', teamCrud.list);
router.get('/team/:id', teamCrud.getById);
router.post('/team', validate(teamMemberSchema), teamCrud.create);
router.patch('/team/:id', validate(updateTeamMemberSchema), teamCrud.update);
router.delete('/team/:id', requireRole('owner', 'admin'), teamCrud.remove);

// Testimonials
router.get('/testimonials', testimonialCrud.list);
router.get('/testimonials/:id', testimonialCrud.getById);
router.post('/testimonials', validate(testimonialSchema), testimonialCrud.create);
router.patch('/testimonials/:id', validate(updateTestimonialSchema), testimonialCrud.update);
router.delete('/testimonials/:id', requireRole('owner', 'admin'), testimonialCrud.remove);

// FAQs
router.get('/faqs', faqCrud.list);
router.get('/faqs/:id', faqCrud.getById);
router.post('/faqs', validate(faqSchema), faqCrud.create);
router.patch('/faqs/:id', validate(updateFaqSchema), faqCrud.update);
router.delete('/faqs/:id', requireRole('owner', 'admin'), faqCrud.remove);

// Media (Cloudinary)
router.get('/media', listMedia);
router.post('/media', uploadImage.array('files', 8), uploadMedia);
router.patch('/media/:id', updateMedia);
router.delete('/media/:id', deleteMedia);

// Settings
router.get('/settings', getSettings);
router.patch('/settings', requireRole('owner', 'admin'), validate(siteSettingsSchema), updateSettings);

// Admin users / roles (owner only)
router.get('/users', requireRole('owner'), listAdminUsers);
router.post('/users', requireRole('owner'), validate(createAdminUserSchema), inviteAdminUser);
router.patch('/users/:id', requireRole('owner'), validate(updateAdminUserSchema), updateAdminUser);
router.delete('/users/:id', requireRole('owner'), deactivateAdminUser);

// Audit logs
router.get('/audit-logs', requireRole('owner', 'admin'), listAuditLogs);

export default router;
