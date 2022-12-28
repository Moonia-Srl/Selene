import { NestJSAuthModule } from '@botika/nestjs-auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getAuthConfig } from 'src/shared/auth.config';
import { Admin } from '../admin/admin.entity';
import { AuthController } from './auth.controller';
import { LoginService } from './auth.service';

@Module({
  imports: [
    // Loads the TypeOrm feature for the Admin table/collection
    TypeOrmModule.forFeature([Admin]),
    // Loads our internal authentication library
    NestJSAuthModule.register(getAuthConfig()),
  ],
  controllers: [AuthController],
  providers: [LoginService],
})
export class AuthModule {}
