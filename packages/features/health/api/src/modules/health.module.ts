import { DynamicModule, Module } from '@nestjs/common';
import { HealthController } from '../controllers/health.controller';
import { GetDetailedHealthUseCase, GetDetailedHealthUseCaseExecuter } from '../use-cases';
import { GetHealthUseCase, GetHealthUseCaseExecuter } from '../use-cases/get-health.use-case';

/**
 * Health Module (NestJS)
 * Module for health check functionality
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {
  static register(): DynamicModule {
    return {
      module: HealthModule,
      imports: [],
      providers: [
        {
          provide: GetHealthUseCase,
          useFactory: () => new GetHealthUseCaseExecuter(),
          inject: [],
        },
        {
          provide: GetDetailedHealthUseCase,
          useFactory: () => new GetDetailedHealthUseCaseExecuter(),
          inject: [],
        }
      ],
      exports: [],
    };
  }
}
