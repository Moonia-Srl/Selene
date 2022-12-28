import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Base } from 'src/shared/base.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { NFT } from '../nft/nft.entity';

@Entity('users')
export class User extends Base {
  // The format required is SOL:0x123456789...012 or ETH: 0x159487263...012
  @ApiProperty() @PrimaryColumn() wallet: string;

  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() surname: string;

  @ApiProperty() @Column() email: string;
  @ApiProperty() @Column() phone: string;

  @ApiProperty({ type: () => NFT, isArray: true })
  @OneToMany(() => NFT, nft => nft.owner)
  @JoinColumn({ name: 'nft_token_ids' })
  nft: NFT[];
}
