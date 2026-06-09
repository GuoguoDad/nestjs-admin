import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { JwtStrategy } from '../infrastructure/strategy/jwt.strategy';
import { UserProvider } from 'src/provider/user.provider';
import { ConfigService } from 'src/service/config.service';

@Module({
  imports: [
    JwtModule.register({
      privateKey: new ConfigService().getString('secretKey'),
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [UserProvider, AuthService, JwtStrategy],
  exports: [UserProvider],
})
export class AuthModule {}
