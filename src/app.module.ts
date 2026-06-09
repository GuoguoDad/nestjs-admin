import { Module } from '@nestjs/common';
import { ConfigModule } from './module/config.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { AuthModule } from './module/auth.module';
import { UploadController } from './controller/upload.controller';
import { UploadService } from './service/upload.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from './service/email.service';
import { TestController } from './controller/test.controller';
import { TaskService } from './task/task.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ScheduleModule.forRoot(),
  ],
  controllers: [UserController, UploadController, TestController],
  providers: [TaskService, UserService, UploadService, EmailService],
})
export class AppModule {}
