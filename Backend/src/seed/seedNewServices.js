/**
 * Standalone, idempotent seed script for adding new services without touching
 * any existing services, or other collections.
 *
 * Safe to run multiple times: each service is matched by its slugified title
 * (case-insensitive) before insert. If a matching service already exists, it
 * is skipped - no updates, no duplicates, no deletions.
 *
 * Usage: npm run seed:new-services
 */
import { connectDB, disconnectDB } from '../config/db.js';
import { Service } from '../models/Service.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { logger } from '../utils/logger.js';
import slugify from 'slugify';

const NEW_SERVICES = [
  {
    title: 'Web Development',
    icon: 'globe',
    shortDescription: 'Modern, responsive and scalable websites built for businesses and startups.',
    description:
      'We build modern and responsive websites tailored to your business requirements. From company websites and landing pages to complex web applications, we focus on clean design, performance, security, and scalability.',
    features: [
      'Responsive Design',
      'Custom UI Development',
      'Frontend Development',
      'Backend Integration',
      'REST API Integration',
      'SEO-Friendly Structure',
    ],
    startingPrice: 15000,
    timeline: '1–3 Weeks',
  },
  {
    title: 'Mobile App Development',
    icon: 'mobile',
    shortDescription: 'Cross-platform mobile applications for Android and iOS.',
    description:
      'We develop modern mobile applications for Android and iOS using React Native and Flutter. Our apps are designed for smooth performance, scalable architecture, secure APIs, and an excellent user experience.',
    features: ['Android & iOS', 'React Native', 'Flutter', 'API Integration', 'Authentication', 'Push Notifications'],
    startingPrice: 30000,
    timeline: '3–6 Weeks',
  },
  {
    title: 'Custom Software Development',
    icon: 'code',
    shortDescription: 'Custom software solutions designed around your unique business requirements.',
    description:
      'We develop custom software solutions that automate business processes and solve specific operational challenges. From planning and architecture to development and deployment, we build solutions designed for scalability and long-term use.',
    features: [
      'Custom Business Logic',
      'Admin Panels',
      'Role-Based Access',
      'API Development',
      'Database Integration',
      'Third-Party Integrations',
    ],
    startingPrice: 40000,
    timeline: '4–8 Weeks',
  },
  {
    title: 'eCommerce Development',
    icon: 'cart',
    shortDescription: 'Feature-rich eCommerce platforms built to support online businesses.',
    description:
      'We build scalable eCommerce platforms with product management, shopping carts, secure payments, order management, customer accounts, and powerful admin panels.',
    features: [
      'Product Management',
      'Shopping Cart',
      'Payment Gateway',
      'Order Management',
      'Admin Dashboard',
      'Customer Management',
    ],
    startingPrice: 35000,
    timeline: '3–6 Weeks',
  },
  {
    title: 'Backend & API Development',
    icon: 'server',
    shortDescription: 'Secure and scalable backend systems and APIs for web and mobile applications.',
    description:
      'We develop reliable backend systems and REST APIs using Node.js, Express.js, Python, and Django. Our backend solutions focus on security, performance, database efficiency, authentication, and scalability.',
    features: [
      'REST APIs',
      'Node.js & Express.js',
      'Python & Django',
      'Authentication',
      'Database Integration',
      'API Security',
    ],
    startingPrice: 20000,
    timeline: '2–4 Weeks',
  },
  {
    title: 'UI/UX & Frontend Development',
    icon: 'layout',
    shortDescription: 'Clean, intuitive and responsive interfaces designed for a better user experience.',
    description:
      'We create modern and user-friendly interfaces that work smoothly across desktop, tablet, and mobile devices. Our frontend development focuses on performance, accessibility, responsive design, and maintainable code.',
    features: [
      'Responsive UI',
      'React.js',
      'JavaScript & TypeScript',
      'Tailwind CSS',
      'Reusable Components',
      'Performance Optimization',
    ],
    startingPrice: 15000,
    timeline: '1–3 Weeks',
  },
  {
    title: 'Logistics & Delivery Solutions',
    icon: 'truck',
    shortDescription: 'On-demand logistics and delivery platforms for businesses and customers.',
    description:
      'We develop logistics and delivery platforms that connect customers with drivers or delivery partners. Solutions can include booking, driver management, fare calculation, live location tracking, order assignment, payments, notifications, and admin management.',
    features: [
      'Customer App',
      'Driver / Partner App',
      'Live GPS Tracking',
      'Booking Management',
      'Fare Calculation',
      'Partner Management',
      'Payment Integration',
      'Admin Dashboard',
    ],
    startingPrice: 100000,
    timeline: '8–14 Weeks',
  },
];

async function seedNewServices() {
  const existingMaxOrder = await Service.findOne().sort({ order: -1 }).select('order').lean();
  let nextOrder = (existingMaxOrder?.order || 0) + 1;

  let inserted = 0;
  let skipped = 0;

  for (const svc of NEW_SERVICES) {
    const candidateSlug = slugify(svc.title, { lower: true, strict: true, trim: true });

    const existing = await Service.findOne({
      $or: [{ slug: candidateSlug }, { title: { $regex: `^${svc.title}$`, $options: 'i' } }],
    });

    if (existing) {
      logger.info(`Skipped (already exists): ${svc.title}`);
      skipped += 1;
      continue;
    }

    const slug = await generateUniqueSlug(Service, svc.title);
    await Service.create({
      ...svc,
      slug,
      order: nextOrder,
      active: true,
    });
    nextOrder += 1;
    inserted += 1;
    logger.info(`Inserted: ${svc.title}`);
  }

  return { inserted, skipped };
}

async function run() {
  await connectDB();
  logger.info('Seeding new services...');

  const { inserted, skipped } = await seedNewServices();

  logger.info(`Done. Inserted: ${inserted}, Skipped (already existed): ${skipped}`);
  await disconnectDB();
  process.exit(0);
}

run().catch((err) => {
  logger.error(`Seed failed: ${err.message}`);
  process.exit(1);
});
