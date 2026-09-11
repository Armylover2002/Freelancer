import { Service } from '../../models/Service.js';
import { createCrudController } from '../../utils/crudFactory.js';

export const serviceCrud = createCrudController({
  Model: Service,
  moduleName: 'services',
  slugField: 'title',
  searchFields: ['title', 'shortDescription'],
});
