import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { UserProvider } from 'src/provider/user.provider';
import { ConfigService } from 'src/service/config.service';
import { JwtStrategy } from '../infrastructure/strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: new ConfigService().getString('secretKey'),
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [UserProvider, AuthService, JwtStrategy],
  exports: [UserProvider, AuthService],
})
export class AuthModule {}
