import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { AdminAuthModule } from './modules/auth/admin-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),


    
    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    
    // Multer 
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('UPLOAD_FOLDER'),
      }),
      inject: [ConfigService],
    }),
    
    ProjectsModule,
    CategoriesModule,
    ContactsModule,
    AdminAuthModule
  ],
})
export class AppModule {}
