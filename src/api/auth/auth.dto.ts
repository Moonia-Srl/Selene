import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export type Auth<T> = {
  accessToken: string;
  refreshToken: string;
  payload: T;
};

export class JwtPayload {
  @ApiProperty() @IsNotEmpty() @IsString() iss: string;
  @ApiProperty() @IsOptional() @IsString() sub?: string;
  @ApiProperty() @IsNotEmpty() @IsArray() @IsString({ each: true }) aud: string[];
  @ApiProperty() @IsNotEmpty() @IsNumber() exp: number;
}

export class LoginDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() @IsString() password: string;
}

export class RefreshDto {
  @ApiProperty() @IsString() @IsNotEmpty() refreshToken: string;
}
