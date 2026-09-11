import { asyncHandler } from './asyncHandler.js';
import { ApiError } from './ApiError.js';
import { ok, created } from './ApiResponse.js';
import { parsePagination, buildMeta } from './pagination.js';
import { generateUniqueSlug } from './slug.js';
import { writeAuditLog } from './audit.js';

/**
 * Builds standard list/get/create/update/remove handlers for a content module
 * that follows the CMS pattern in the spec (CRUD, publish/active toggle, order, slug).
 * Kept generic on purpose: projects/services/pricing/team/testimonials/faqs all share
 * this exact shape, so a bespoke controller per module would just duplicate this logic six times.
 */
export function createCrudController({
  Model,
  moduleName,
  slugField, // field used to derive the slug, e.g. 'title' or 'name'. Pass null to skip slugging.
  searchFields = [],
  defaultSort = { order: 1, createdAt: -1 },
}) {
  const list = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 20 });
    const filter = {};

    if (req.query.active !== undefined) filter.active = req.query.active === 'true';
    if (req.query.published !== undefined) filter.published = req.query.published === 'true';
    if (req.query.status) filter.status = req.query.status;

    if (req.query.search && searchFields.length) {
      filter.$or = searchFields.map((f) => ({ [f]: { $regex: req.query.search, $options: 'i' } }));
    }

    const [items, total] = await Promise.all([
      Model.find(filter).sort(defaultSort).skip(skip).limit(limit).lean(),
      Model.countDocuments(filter),
    ]);

    ok(res, items, buildMeta({ page, limit, total }));
  });

  const getById = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id).lean();
    if (!doc) throw ApiError.notFound(`${moduleName} not found`);
    ok(res, doc);
  });

  const create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    if (slugField && payload[slugField]) {
      payload.slug = await generateUniqueSlug(Model, payload[slugField]);
    }
    const doc = await Model.create(payload);

    await writeAuditLog({
      actor: req.admin,
      action: 'create',
      module: moduleName,
      entityId: doc._id,
      after: doc.toObject(),
    });

    created(res, doc);
  });

  const update = asyncHandler(async (req, res) => {
    const existing = await Model.findById(req.params.id);
    if (!existing) throw ApiError.notFound(`${moduleName} not found`);
    const before = existing.toObject();

    const payload = { ...req.body };
    if (slugField && payload[slugField] && payload[slugField] !== existing[slugField]) {
      payload.slug = await generateUniqueSlug(Model, payload[slugField], { excludeId: existing._id });
    }

    Object.assign(existing, payload);
    await existing.save();

    await writeAuditLog({
      actor: req.admin,
      action: 'update',
      module: moduleName,
      entityId: existing._id,
      before,
      after: existing.toObject(),
    });

    ok(res, existing);
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw ApiError.notFound(`${moduleName} not found`);
    await doc.deleteOne();

    await writeAuditLog({
      actor: req.admin,
      action: 'delete',
      module: moduleName,
      entityId: doc._id,
      before: doc.toObject(),
    });

    ok(res, { deleted: true });
  });

  return { list, getById, create, update, remove };
}
