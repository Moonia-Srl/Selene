import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudOptions } from '@nestjsx/crud';
import { ContractDto } from './contract.dto';
import { Contract } from './contract.entity';
import { ContractService } from './contract.service';

const CrudConfiguration: CrudOptions = {
  model: { type: Contract },
  dto: { create: ContractDto, update: ContractDto },
  params: { address: { field: 'address', type: 'string', primary: true } },
  query: { join: { nft: { eager: false }, project: { eager: false } } },
  routes: process.env.NODE_ENV !== 'development' ? { only: ['getOneBase'] } : null,
};

@Crud(CrudConfiguration)
@Controller('contracts')
@ApiTags('Contracts')
export class ContractController {
  constructor(public service: ContractService) {}
}
