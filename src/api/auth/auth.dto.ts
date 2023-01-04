import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class AuthDTO<T> { 
  @ApiProperty() @IsNotEmpty() @IsObject() payload: T; 
  @ApiProperty() @IsNotEmpty() @IsString() access: string; 
  @ApiProperty() @IsNotEmpty() @IsString() refresh: string;
};

export class LoginDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() @IsString() password: string;
}

export class RefreshDto {
  @ApiProperty() @IsString() @IsNotEmpty() refreshToken: string;
}
