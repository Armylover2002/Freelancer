import { Testimonial } from '../../models/Testimonial.js';
import { createCrudController } from '../../utils/crudFactory.js';

export const testimonialCrud = createCrudController({
  Model: Testimonial,
  moduleName: 'testimonials',
  slugField: null,
  searchFields: ['clientName', 'company', 'quote'],
  defaultSort: { order: 1, createdAt: -1 },
});
