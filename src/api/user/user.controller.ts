import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudOptions } from '@nestjsx/crud';
import { UserDto as UserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

const CrudConfiguration: CrudOptions = {
  model: { type: User },
  dto: { create: UserDto, update: UserDto },
  params: { wallet: { field: 'wallet', type: 'string', primary: true } },
  query: { join: { nft: { eager: false } } },
  routes: process.env.NODE_ENV !== 'development' ? { only: ['getOneBase', 'createOneBase'] } : null,
};

@Crud(CrudConfiguration)
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(public service: UserService) {}
}
