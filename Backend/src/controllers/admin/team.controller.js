import { TeamMember } from '../../models/TeamMember.js';
import { createCrudController } from '../../utils/crudFactory.js';

export const teamCrud = createCrudController({
  Model: TeamMember,
  moduleName: 'teamMembers',
  slugField: 'name',
  searchFields: ['name', 'role', 'specialty'],
});
