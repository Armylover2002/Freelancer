import { Media } from '../../models/Media.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ok, created } from '../../utils/ApiResponse.js';
import { parsePagination, buildMeta } from '../../utils/pagination.js';
import { uploadBufferToCloudinary, destroyCloudinaryAsset, isCloudinaryConfigured } from '../../config/cloudinary.js';
import { writeAuditLog } from '../../utils/audit.js';

export const listMedia = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 30 });
  const filter = {};
  if (req.query.folder) filter.folder = req.query.folder;
  if (req.query.tag) filter.tags = req.query.tag;

  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Media.countDocuments(filter),
  ]);
  ok(res, items, buildMeta({ page, limit, total }));
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured) throw ApiError.internal('Cloudinary is not configured on the server');
  if (!req.files?.length && !req.file) throw ApiError.badRequest('No file(s) provided');

  const files = req.files?.length ? req.files : [req.file];
  const folder = req.body.folder ? `agency/${req.body.folder}` : 'agency/media';

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const result = await uploadBufferToCloudinary(file.buffer, { folder });
      return Media.create({
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        altText: req.body.altText || '',
        folder,
        tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : [],
        uploadedBy: req.admin._id,
      });
    })
  );

  await writeAuditLog({
    actor: req.admin,
    action: 'create',
    module: 'media',
    metadata: { count: uploaded.length },
  });

  created(res, uploaded);
});

export const updateMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw ApiError.notFound('Media not found');

  if (req.body.altText !== undefined) media.altText = req.body.altText;
  if (req.body.tags !== undefined) media.tags = req.body.tags;
  if (req.body.folder !== undefined) media.folder = req.body.folder;
  await media.save();

  ok(res, media);
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw ApiError.notFound('Media not found');

  if (isCloudinaryConfigured) {
    await destroyCloudinaryAsset(media.publicId, media.resourceType).catch(() => null);
  }
  await media.deleteOne();

  await writeAuditLog({
    actor: req.admin,
    action: 'delete',
    module: 'media',
    entityId: media._id,
    before: media.toObject(),
  });

  ok(res, { deleted: true });
});
