import slugify from 'slugify';

export async function generateUniqueSlug(Model, text, { excludeId } = {}) {
  const base = slugify(text, { lower: true, strict: true, trim: true }).slice(0, 100) || 'item';
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}
