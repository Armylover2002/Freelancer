import { Project } from '../../models/Project.js';
import { Service } from '../../models/Service.js';
import { PricingPlan } from '../../models/PricingPlan.js';
import { TeamMember } from '../../models/TeamMember.js';
import { Testimonial } from '../../models/Testimonial.js';
import { Faq } from '../../models/Faq.js';
import { SiteSettings } from '../../models/SiteSettings.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ok } from '../../utils/ApiResponse.js';
import { parsePagination, buildMeta } from '../../utils/pagination.js';

const PROJECT_CARD_FIELDS =
  'title slug businessType category summary coverImage techStack isFeatured createdAt';

export const listPublicProjects = asyncHandler(async (req, res) => {
  const { category, featured, search } = req.query;
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 9 });

  const filter = { status: 'published' };
  if (category && category !== 'all') filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$text = { $search: search };

  const [items, total, categories] = await Promise.all([
    Project.find(filter)
      .select(PROJECT_CARD_FIELDS)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
    Project.distinct('category', { status: 'published' }),
  ]);

  ok(res, items, { ...buildMeta({ page, limit, total }), categories });
});

export const getPublicProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, status: 'published' }).lean();
  if (!project) throw ApiError.notFound('Project not found');
  ok(res, project);
});

export const listPublicServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
  ok(res, services);
});

export const listPublicPricing = asyncHandler(async (req, res) => {
  const plans = await PricingPlan.find({ active: true }).sort({ order: 1, startingPrice: 1 }).lean();
  ok(res, plans);
});

export const listPublicTeam = asyncHandler(async (req, res) => {
  const team = await TeamMember.find({ active: true })
    .select('name slug photo role experienceText specialty technologies bio socials order')
    .sort({ order: 1, createdAt: 1 })
    .lean();
  ok(res, team);
});

export const listPublicTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  ok(res, testimonials);
});

export const listPublicFaqs = asyncHandler(async (req, res) => {
  const faqs = await Faq.find({ published: true }).sort({ category: 1, order: 1 }).lean();
  ok(res, faqs);
});

export const getPublicSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({ singletonKey: 'main' }).lean();
  if (!settings) settings = (await SiteSettings.create({})).toObject();

  // Only ever return public-safe fields - never secrets/internal flags.
  const publicSafe = {
    branding: settings.branding,
    contact: settings.contact,
    socials: settings.socials,
    seoDefaults: settings.seoDefaults,
    ctaLabels: settings.ctaLabels,
    featureFlags: { maintenanceMode: settings.featureFlags?.maintenanceMode ?? false },
    enquiryConfirmationMessage: settings.enquiryConfirmationMessage,
    legal: {
      privacyPolicy: settings.legal?.privacyPolicy || '',
      termsOfService: settings.legal?.termsOfService || '',
    },
  };

  ok(res, publicSafe);
});
