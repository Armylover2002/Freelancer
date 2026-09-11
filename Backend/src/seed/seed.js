/**
 * Seed script - creates the operational baseline only:
 *   - one owner admin account (from env)
 *   - default site settings (singleton)
 *   - starter services/pricing copy (the agency's own offerings, editable in Admin)
 *   - a small set of generic process/process FAQs
 *
 * Deliberately does NOT seed projects, team members or testimonials with placeholder
 * client data - the spec requires only genuine agency content there. Add real ones
 * through the Admin panel after the first login.
 *
 * Usage: npm run seed
 */
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Service } from '../models/Service.js';
import { PricingPlan } from '../models/PricingPlan.js';
import { Faq } from '../models/Faq.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { logger } from '../utils/logger.js';

async function seedOwnerAdmin() {
  if (!env.admin.email || !env.admin.password) {
    logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping owner admin seed');
    return;
  }

  const existing = await AdminUser.findOne({ email: env.admin.email });
  if (existing) {
    logger.info(`Owner admin already exists: ${env.admin.email}`);
    return;
  }

  const passwordHash = await AdminUser.hashPassword(env.admin.password);
  await AdminUser.create({
    name: env.admin.name,
    email: env.admin.email,
    passwordHash,
    role: 'owner',
  });
  logger.info(`Created owner admin: ${env.admin.email}`);
}

async function seedSiteSettings() {
  const existing = await SiteSettings.findOne({ singletonKey: 'main' });
  if (existing) {
    logger.info('Site settings already exist - skipping');
    return;
  }
  await SiteSettings.create({
    branding: {
      agencyName: 'Your Web Development Studio',
      tagline: 'We design and build software that grows your business.',
    },
  });
  logger.info('Created default site settings');
}

const STARTER_SERVICES = [
  {
    title: 'Business Websites',
    shortDescription: 'Fast, modern, mobile-first websites that represent your business well.',
    description: 'A responsive marketing website built around clear messaging, strong calls-to-action and SEO fundamentals.',
    features: ['Custom UI/UX design', 'Mobile responsive', 'SEO fundamentals', 'Contact & lead forms'],
    order: 1,
  },
  {
    title: 'E-Commerce Development',
    shortDescription: 'Full-featured online stores with secure payments and inventory management.',
    description: 'End-to-end e-commerce builds covering catalog, cart, checkout, payments and order management.',
    features: ['Product catalog & search', 'Secure checkout', 'Payment gateway integration', 'Admin order management'],
    order: 2,
  },
  {
    title: 'Web Applications & SaaS',
    shortDescription: 'Custom dashboards, portals and SaaS products built on modern stacks.',
    description: 'Full-stack web application development including authentication, role-based access and APIs.',
    features: ['Custom dashboards', 'Authentication & roles', 'REST/GraphQL APIs', 'Third-party integrations'],
    order: 3,
  },
  {
    title: 'Maintenance & Support',
    shortDescription: 'Ongoing updates, monitoring and support after launch.',
    description: 'Post-launch retainer covering bug fixes, security patches, content updates and monitoring.',
    features: ['Security patches', 'Performance monitoring', 'Content updates', 'Priority support'],
    order: 4,
  },
];

async function seedServices() {
  const count = await Service.countDocuments();
  if (count > 0) {
    logger.info('Services already seeded - skipping');
    return;
  }
  for (const svc of STARTER_SERVICES) {
    const slug = await generateUniqueSlug(Service, svc.title);
    await Service.create({ ...svc, slug });
  }
  logger.info(`Seeded ${STARTER_SERVICES.length} starter services`);
}

const STARTER_PLANS = [
  {
    name: 'Starter',
    startingPrice: 15000,
    billingUnit: 'project',
    features: ['Up to 5 pages', 'Responsive design', 'Basic SEO setup', 'Contact form'],
    exclusions: ['Custom backend', 'Payment integration'],
    timeline: '1-2 weeks',
    order: 1,
  },
  {
    name: 'Business',
    startingPrice: 40000,
    billingUnit: 'project',
    features: ['Up to 12 pages', 'CMS-driven content', 'Advanced SEO', 'Analytics integration'],
    exclusions: ['Custom mobile app'],
    timeline: '3-4 weeks',
    featured: true,
    order: 2,
  },
  {
    name: 'E-Commerce',
    startingPrice: 70000,
    billingUnit: 'project',
    features: ['Full product catalog', 'Secure checkout', 'Payment gateway', 'Admin dashboard'],
    exclusions: ['Custom ERP integration'],
    timeline: '4-6 weeks',
    order: 3,
  },
  {
    name: 'Custom / Enterprise',
    startingPrice: 120000,
    billingUnit: 'project',
    features: ['Custom architecture', 'Dedicated project manager', 'SLA-backed support'],
    exclusions: [],
    timeline: 'Scoped after discovery',
    order: 4,
  },
];

async function seedPricing() {
  const count = await PricingPlan.countDocuments();
  if (count > 0) {
    logger.info('Pricing plans already seeded - skipping');
    return;
  }
  for (const plan of STARTER_PLANS) {
    const slug = await generateUniqueSlug(PricingPlan, plan.name);
    await PricingPlan.create({ ...plan, slug });
  }
  logger.info(`Seeded ${STARTER_PLANS.length} pricing plans`);
}

const STARTER_FAQS = [
  {
    category: 'Process',
    question: 'What does your development process look like?',
    answer: 'We follow Discovery, Requirements, Proposal, UI/UX, Development, Testing, Launch and Support - keeping you updated at every stage.',
    order: 1,
  },
  {
    category: 'Process',
    question: 'How do I start a project?',
    answer: 'Submit the "Start Your Project" form with your requirements. We review it and get back to you to schedule a discovery call.',
    order: 2,
  },
  {
    category: 'Pricing',
    question: 'Are the prices shown final?',
    answer: 'Listed prices are starting prices. Final pricing depends on the exact scope agreed after discovery.',
    order: 1,
  },
  {
    category: 'Support',
    question: 'Do you provide support after launch?',
    answer: 'Yes, we offer maintenance and support plans to keep your site secure, updated and performing well after launch.',
    order: 1,
  },
];

async function seedFaqs() {
  const count = await Faq.countDocuments();
  if (count > 0) {
    logger.info('FAQs already seeded - skipping');
    return;
  }
  await Faq.insertMany(STARTER_FAQS);
  logger.info(`Seeded ${STARTER_FAQS.length} FAQs`);
}

async function run() {
  await connectDB();
  logger.info('Seeding database...');

  await seedOwnerAdmin();
  await seedSiteSettings();
  await seedServices();
  await seedPricing();
  await seedFaqs();

  logger.info('Seed complete. Add real projects, team members and testimonials via the Admin panel.');
  await disconnectDB();
  process.exit(0);
}

run().catch((err) => {
  logger.error(`Seed failed: ${err.message}`);
  process.exit(1);
});
