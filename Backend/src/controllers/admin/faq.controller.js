import { Faq } from '../../models/Faq.js';
import { createCrudController } from '../../utils/crudFactory.js';

export const faqCrud = createCrudController({
  Model: Faq,
  moduleName: 'faqs',
  slugField: null,
  searchFields: ['question', 'answer', 'category'],
  defaultSort: { category: 1, order: 1 },
});
