import { Project } from '../../models/Project.js';
import { createCrudController } from '../../utils/crudFactory.js';

export const projectCrud = createCrudController({
  Model: Project,
  moduleName: 'projects',
  slugField: 'title',
  searchFields: ['title', 'summary', 'category', 'businessType'],
  defaultSort: { isFeatured: -1, order: 1, createdAt: -1 },
});
