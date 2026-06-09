import { DataSource } from 'typeorm';
import { Users } from '../entity/user.entity';
import { ConfigService } from 'src/service/config.service';

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
      logger: 'file',
    });
    return AppDataSource.initialize();
  },
  inject: [ConfigService],
};
