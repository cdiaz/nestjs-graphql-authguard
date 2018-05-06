import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}