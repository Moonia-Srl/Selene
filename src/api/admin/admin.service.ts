import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService extends TypeOrmCrudService<Admin> {
  constructor(@InjectRepository(Admin) repository) {
    super(repository);
  }
}
