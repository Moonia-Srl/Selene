import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudOptions } from '@nestjsx/crud';
import { ProjectDto } from './project.dto';
import { Project } from './project.entity';
import { ProjectService } from './project.service';

const CrudConfiguration: CrudOptions = {
  model: { type: Project },
  dto: { create: ProjectDto, update: ProjectDto },
  params: { slug: { field: 'slug', type: 'string', primary: true } },
  query: { join: { contracts: { eager: false }, admins: { eager: false } } },
  routes: process.env.NODE_ENV !== 'development' ? { only: ['getOneBase'] } : null,
};

@Crud(CrudConfiguration)
@Controller('projects')
@ApiTags('Projects')
export class ProjectController {
  constructor(public service: ProjectService) {}
}
