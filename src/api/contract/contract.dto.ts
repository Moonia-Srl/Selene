import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsMultichainAddress } from 'src/helper/validation.helper';

class SubProjectDto {
  @ApiProperty() @IsNotEmpty() @IsString() slug: string;
}

export class ContractDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsMultichainAddress() address: string;

  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiProperty() @IsNotEmpty() @IsString() symbol: string;

  @ApiProperty() @IsOptional() @IsString() abi?: string;

  @ApiProperty({ type: () => SubProjectDto })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SubProjectDto)
  project: SubProjectDto;
}
