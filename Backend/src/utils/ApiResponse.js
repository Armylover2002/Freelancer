export function ok(res, data, meta = undefined, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function created(res, data, meta = undefined) {
  return ok(res, data, meta, 201);
}
