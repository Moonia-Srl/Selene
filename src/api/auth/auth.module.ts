import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/admin.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // Loads the TypeOrm feature for the Admin table/collection
    TypeOrmModule.forFeature([Admin]),
    // TODO (Enea): Add JwtService module configuration
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
