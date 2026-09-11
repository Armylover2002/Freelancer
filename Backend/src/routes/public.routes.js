import { Router } from 'express';
import {
  listPublicProjects,
  getPublicProjectBySlug,
  listPublicServices,
  listPublicPricing,
  listPublicTeam,
  listPublicTestimonials,
  listPublicFaqs,
  getPublicSettings,
} from '../controllers/public/content.controller.js';
import { createEnquiry, uploadEnquiryFile } from '../controllers/public/enquiry.controller.js';
import { recordAnalyticsEvent } from '../controllers/public/analytics.controller.js';
import { validate } from '../middleware/validate.js';
import { createEnquirySchema } from '../validators/enquiry.validator.js';
import { analyticsEventSchema } from '../validators/analytics.validator.js';
import { enquiryLimiter, analyticsLimiter } from '../middleware/rateLimiters.js';
import { uploadBriefFiles } from '../middleware/upload.js';

const router = Router();

router.get('/projects', listPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);
router.get('/services', listPublicServices);
router.get('/pricing', listPublicPricing);
router.get('/team', listPublicTeam);
router.get('/testimonials', listPublicTestimonials);
router.get('/faqs', listPublicFaqs);
router.get('/settings', getPublicSettings);

router.post('/enquiries', enquiryLimiter, validate(createEnquirySchema), createEnquiry);
router.post('/enquiries/upload', enquiryLimiter, uploadBriefFiles.single('file'), uploadEnquiryFile);

router.post('/analytics/events', analyticsLimiter, validate(analyticsEventSchema), recordAnalyticsEvent);

export default router;
