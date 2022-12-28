import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsMultichainAddress } from '../../helper/validation.helper';

export class UserDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsMultichainAddress() wallet: string;

  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiProperty() @IsNotEmpty() @IsString() surname: string;

  @ApiProperty() @IsNotEmpty() @IsString() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() @IsString() phone: string;
}
