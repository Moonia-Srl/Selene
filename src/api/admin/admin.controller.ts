import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudOptions } from '@nestjsx/crud';
import { AdminDto } from 'src/api/admin/admin.dto';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';

const CrudConfiguration: CrudOptions = {
  model: { type: Admin },
  dto: { create: AdminDto, update: AdminDto },
  params: { id: { field: 'id', type: 'string', primary: true } },
  query: { join: { project: { eager: false } } },
  routes: process.env.NODE_ENV !== 'development' ? { only: ['getOneBase'] } : null,
};

@Crud(CrudConfiguration)
@Controller('admins')
@ApiTags('Admins')
export class AdminController {
  constructor(public service: AdminService) {}
}
