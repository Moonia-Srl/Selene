import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { NFT } from '../nft/nft.entity';
import { Project } from '../project/project.entity';

@Entity('contracts')
export class Contract extends Base {
  @ApiProperty() @PrimaryColumn() address: string;

  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() symbol: string;

  @ApiProperty() @Column({ nullable: true, default: null }) abi?: string;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, project => project.contracts)
  @JoinColumn({ name: 'project_slug' })
  project: Project;

  @ApiProperty({ type: () => NFT, isArray: true })
  @OneToMany(() => NFT, nft => nft.contract)
  @JoinColumn({ name: 'nft_token_ids' })
  nft: NFT[];
}
