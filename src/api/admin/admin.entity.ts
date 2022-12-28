import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { Project } from '../project/project.entity';

@Entity('admins')
export class Admin extends Base {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() surname: string;

  @ApiProperty() @Column({ unique: true }) email: string;
  @ApiProperty() @Column() payload: string; // The hashed password

  @Column({ nullable: true }) refreshToken?: string;

  @ManyToOne(() => Project, project => project.admins)
  @JoinColumn({ name: 'project_slug' })
  project: Project;
}
