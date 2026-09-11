import { PricingPlan } from '../../models/PricingPlan.js';
import { createCrudController } from '../../utils/crudFactory.js';

export const pricingCrud = createCrudController({
  Model: PricingPlan,
  moduleName: 'pricingPlans',
  slugField: 'name',
  searchFields: ['name'],
  defaultSort: { order: 1, startingPrice: 1 },
});
