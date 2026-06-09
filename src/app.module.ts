import { Module } from '@nestjs/common';
import { ConfigModule } from './module/config.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { AuthModule } from './module/auth.module';
import { UploadController } from './controller/upload.controller';
import { UploadService } from './service/upload.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [UserController, UploadController],
  providers: [UserService, UploadService],
})
export class AppModule {}
