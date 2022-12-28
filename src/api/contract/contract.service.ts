import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Contract } from './contract.entity';

@Injectable()
export class ContractService extends TypeOrmCrudService<Contract> {
  constructor(@InjectRepository(Contract) repository) {
    super(repository);
  }
}
