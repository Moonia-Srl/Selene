import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Base } from 'src/shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Contract } from '../contract/contract.entity';
import { User } from '../user/user.entity';

class Metadata {
  @ApiProperty() type: string;
  @ApiProperty() value: string;
}

@Entity('nfts')
export class NFT extends Base {
  @ApiProperty() @PrimaryColumn() tokenId: string;

  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() supply: number;
  @ApiProperty() @Column() assetUrl: string;

  @ApiProperty({ type: () => Metadata, isArray: true })
  @Column({ type: 'jsonb', default: () => "'[]'", nullable: false })
  metadata: Metadata[];

  @ApiProperty({ type: () => Contract })
  @ManyToOne(() => Contract, contract => contract.nft)
  @JoinColumn({ name: 'contract_address' })
  contract: Contract;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.wallet, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'owner_wallet' })
  owner?: User;

  @Column()
  owner_wallet: string;
}
