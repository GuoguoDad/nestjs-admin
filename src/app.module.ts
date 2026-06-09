import { Module } from '@nestjs/common';
import { ConfigModule } from './module/config.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserProvider } from './provider/user.provider';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserProvider, UserService],
})
export class AppModule {}
