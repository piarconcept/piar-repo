import { Controller, Get, Inject } from '@nestjs/common';
import type { HealthStatus } from '@piar/health-configuration';
import { GetDetailedHealthUseCase, GetHealthUseCase } from '../use-cases';

/**
 * Health Controller (NestJS)
 * Provides health check endpoints
 */
@Controller('health')
export class HealthController {
  constructor(
    @Inject(GetHealthUseCase)
    private readonly getHealthUseCase: GetHealthUseCase,
    @Inject(GetDetailedHealthUseCase)
    private readonly getDetailedHealthUseCase: GetDetailedHealthUseCase
  ) {}

  /**
   * GET /health
   * Basic health check endpoint
   */
  @Get()
  async getHealth(): Promise<HealthStatus> {
    return this.getHealthUseCase.execute();
  }

  /**
   * GET /health/detailed
   * Detailed health check with all checks
   */
  @Get('detailed')
  async getDetailedHealth(): Promise<HealthStatus> {
    return this.getDetailedHealthUseCase.execute();
  }
}
