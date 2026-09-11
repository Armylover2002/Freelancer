import { Client } from '../../models/Client.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ok } from '../../utils/ApiResponse.js';
import { parsePagination, buildMeta } from '../../utils/pagination.js';

export const listClients = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 20 });
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { business: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Client.countDocuments(filter),
  ]);
  ok(res, items, buildMeta({ page, limit, total }));
});

export const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).populate('sourceEnquiryId').lean();
  if (!client) throw ApiError.notFound('Client not found');
  ok(res, client);
});

export const addClientNote = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw ApiError.notFound('Client not found');
  client.notes.push({ text: req.body.text, author: req.admin._id });
  await client.save();
  ok(res, client);
});

export const updateClientStatus = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw ApiError.notFound('Client not found');
  client.status = req.body.status;
  await client.save();
  ok(res, client);
});
