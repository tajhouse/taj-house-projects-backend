import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser'; // ✅ ضيف السطر ده

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ زيادة الحد الأقصى لحجم البيانات
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // 📁 لعرض الملفات من مجلد uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const configService = app.get(ConfigService);

  // 🌐 تفعيل CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
  });

  // ✅ تفعيل الـ ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 📦 مسار عام للـ API
  app.setGlobalPrefix('api/v1');

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`📚 API running on: http://localhost:${port}/api/v1`);
}

bootstrap();
