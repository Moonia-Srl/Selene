import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

class SubProjectDto {
  @ApiProperty() @IsNotEmpty() @IsString() slug: string;
}

export class AdminDto {
  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() surname: string;

  @ApiProperty() @IsNotEmpty() @IsString() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() @IsString() password: string;

  @ApiProperty({ type: () => SubProjectDto })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SubProjectDto)
  project: SubProjectDto;
}
