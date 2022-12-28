import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @ApiProperty() @CreateDateColumn() created_at: Date;
  @ApiProperty() @UpdateDateColumn() updated_at: Date;
  @ApiProperty() @DeleteDateColumn() deleted_at: Date;
}
