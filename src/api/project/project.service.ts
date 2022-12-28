import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService extends TypeOrmCrudService<Project> {
  constructor(@InjectRepository(Project) repository) {
    super(repository);
  }
}
