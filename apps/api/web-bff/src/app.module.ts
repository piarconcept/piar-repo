import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@piar/health-api';
import { loadConfigurationParams } from './config';

const ENV_FILE = '.env';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [() => loadConfigurationParams()],
      envFilePath: [ENV_FILE],
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
