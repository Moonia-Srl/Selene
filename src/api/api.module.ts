import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ContractModule } from './contract/contract.module';
import { NFTModule } from './nft/nft.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AdminModule, ContractModule, NFTModule, ProjectModule, UserModule],
})

export class ApiModule { }
