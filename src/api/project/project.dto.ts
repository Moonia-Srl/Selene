import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsHexColor,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

class SubEnvDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsUrl() logo: string;
  @ApiProperty() @IsNotEmpty() @IsString() @IsHexColor() color: string;
}

export class ProjectDto {
  @ApiProperty() @IsNotEmpty() @IsString() slug: string;
  @ApiProperty() @IsNotEmpty() @IsString() name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SubEnvDto)
  env: SubEnvDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  expire_at: string;
}
