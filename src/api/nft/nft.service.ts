import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { NFT } from './nft.entity';

@Injectable()
export class NFTService extends TypeOrmCrudService<NFT> {
  constructor(@InjectRepository(NFT) repository) {
    super(repository);
  }
}
