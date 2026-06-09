import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseSuccessTransformInterceptor } from './infrastructure/interceptor/response.success.transform.interceptor';
import { ResponseErrorExceptionFilter } from './infrastructure/filter/response.error.exception.filter';
import { ParamsValidationPipe } from './infrastructure/pipe/params.validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('')
    .setDescription('')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.useGlobalPipes(new ParamsValidationPipe());
  app.useGlobalFilters(new ResponseErrorExceptionFilter());
  app.useGlobalInterceptors(new ResponseSuccessTransformInterceptor());
  await app.listen(3000, () => {
    console.log(
      `application started successfully, swagger address: http://127.0.0.1:3000/api`,
    );
  });
}
bootstrap();
