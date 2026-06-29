import { Module, Global } from '@nestjs/common'
import { ConfigService } from 'src/service/config.service'
import { DatabaseProvider } from '../provider/database.provider'

@Global()
@Module({
  providers: [ConfigService, DatabaseProvider],
  exports: [ConfigService, DatabaseProvider],
})
export class ConfigModule {}
