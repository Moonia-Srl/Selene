import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { Admin } from '../admin/admin.entity';
import { Contract } from '../contract/contract.entity';

class ProjectEnv {
  @ApiProperty() logo: string;
  @ApiProperty() color: string;
}

@Entity('projects')
export class Project extends Base {
  @ApiProperty() @PrimaryColumn() slug: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() expire_at: Date;

  @ApiProperty({ type: () => ProjectEnv })
  @Column({ type: 'jsonb', default: () => "'{}'", nullable: false })
  env: ProjectEnv;

  @ApiProperty({ type: () => Admin, isArray: true })
  @OneToMany(() => Admin, admin => admin.project)
  @JoinColumn({ name: 'admin_ids' })
  admins: Admin[];

  @ApiProperty({ type: () => Contract, isArray: true })
  @OneToMany(() => Contract, contract => contract.project)
  @JoinColumn({ name: 'contract_addresses' })
  contracts: Contract[];
}
