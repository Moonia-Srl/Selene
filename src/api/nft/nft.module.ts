import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NFTController } from './nft.controller';
import { NFT } from './nft.entity';
import { NFTService } from './nft.service';

@Module({
  imports: [TypeOrmModule.forFeature([NFT])],
  controllers: [NFTController],
  exports: [NFTService],
  providers: [NFTService],
})
export class NFTModule {}
