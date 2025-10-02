import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService) => ({
  uri: configService.get<string>('MONGODB_URI'),
  dbName: configService.get<string>('DATABASE_NAME'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
