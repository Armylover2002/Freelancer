import { Enquiry, ENQUIRY_STATUSES } from '../../models/Enquiry.js';
import { Client } from '../../models/Client.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ok } from '../../utils/ApiResponse.js';
import { parsePagination, buildMeta } from '../../utils/pagination.js';
import { writeAuditLog } from '../../utils/audit.js';

export const listEnquiries = asyncHandler(async (req, res) => {
  const { status, priority, assignee, search, archived } = req.query;
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 20 });

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) filter.assignee = assignee;
  filter.archived = archived === 'true';

  if (search) {
    filter.$or = [
      { 'contact.name': { $regex: search, $options: 'i' } },
      { 'contact.email': { $regex: search, $options: 'i' } },
      { 'contact.business': { $regex: search, $options: 'i' } },
      { 'contact.phone': { $regex: search, $options: 'i' } },
    ];
  }

  const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Enquiry.find(filter)
      .populate('assignee', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(filter),
  ]);

  ok(res, items, buildMeta({ page, limit, total }));
});

export const getEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id)
    .populate('assignee', 'name email')
    .populate('notes.author', 'name')
    .lean();
  if (!enquiry) throw ApiError.notFound('Enquiry not found');
  ok(res, enquiry);
});

export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) throw ApiError.notFound('Enquiry not found');

  const fromStatus = enquiry.status;
  if (!ENQUIRY_STATUSES.includes(status)) throw ApiError.badRequest('Invalid status');

  enquiry.status = status;
  enquiry.activity.push({
    type: 'status_change',
    fromStatus,
    toStatus: status,
    actor: req.admin._id,
    actorName: req.admin.name,
    message: note,
  });
  if (note) {
    enquiry.notes.push({ text: note, author: req.admin._id, authorName: req.admin.name });
  }
  await enquiry.save();

  if (status === 'WON') {
    const exists = await Client.findOne({ email: enquiry.contact.email });
    if (!exists) {
      await Client.create({
        name: enquiry.contact.name,
        business: enquiry.contact.business,
        email: enquiry.contact.email,
        phone: enquiry.contact.phone,
        country: enquiry.contact.country,
        sourceEnquiryId: enquiry._id,
      });
    }
  }

  await writeAuditLog({
    actor: req.admin,
    action: 'status_change',
    module: 'enquiries',
    entityId: enquiry._id,
    before: { status: fromStatus },
    after: { status },
  });

  ok(res, enquiry);
});

export const addEnquiryNote = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) throw ApiError.notFound('Enquiry not found');

  enquiry.notes.push({ text: req.body.text, author: req.admin._id, authorName: req.admin.name });
  enquiry.activity.push({
    type: 'note_added',
    actor: req.admin._id,
    actorName: req.admin.name,
    message: req.body.text,
  });
  await enquiry.save();
  ok(res, enquiry);
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) throw ApiError.notFound('Enquiry not found');

  const before = enquiry.toObject();
  Object.assign(enquiry, req.body);
  if (req.body.assignee) {
    enquiry.activity.push({
      type: 'assigned',
      actor: req.admin._id,
      actorName: req.admin.name,
      message: `Assigned enquiry`,
    });
  }
  await enquiry.save();

  await writeAuditLog({
    actor: req.admin,
    action: 'update',
    module: 'enquiries',
    entityId: enquiry._id,
    before: { priority: before.priority, assignee: before.assignee, tags: before.tags },
    after: req.body,
  });

  ok(res, enquiry);
});

export const exportEnquiriesCsv = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();

  const header = [
    'Name',
    'Business',
    'Email',
    'Phone',
    'Project Type',
    'Budget',
    'Timeline',
    'Status',
    'Priority',
    'Created At',
  ];
  const rows = enquiries.map((e) => [
    e.contact?.name,
    e.contact?.business,
    e.contact?.email,
    e.contact?.phone,
    e.projectType,
    e.budgetRange,
    e.timeline,
    e.status,
    e.priority,
    new Date(e.createdAt).toISOString(),
  ]);

  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [header, ...rows].map((r) => r.map(escape).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="enquiries.csv"');
  res.send(csv);
});
