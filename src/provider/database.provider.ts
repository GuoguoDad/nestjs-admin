import { DataSource } from 'typeorm';
import { Users } from '../entity/user.entity';
import { ConfigService } from 'src/service/config.service';
import { HourlyFileLogger } from '../infrastructure/logger/hourly.file.logger';

export const DatabaseProvider = {
  provide: 'CommonDataSource',
  useFactory: async (config: ConfigService) => {
    const AppDataSource = new DataSource({
      type: 'postgres',
      host: config.getString('DB_HOST'),
      port: config.getNumber('DB_PORT'),
      username: config.getString('DB_USER'),
      password: config.getString('DB_PASSWORD'),
      database: config.getString('DB_NAME'),
      entities: [Users],
      synchronize: true,
      logging: ['query', 'error'],
      logger: new HourlyFileLogger(
        ['query', 'error', 'info', 'warn'],
        './logs',
      ),
    });
    return AppDataSource.initialize();
  },
  inject: [ConfigService],
};
