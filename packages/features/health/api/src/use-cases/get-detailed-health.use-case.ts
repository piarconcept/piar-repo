import { HealthStatus } from "@piar/health-configuration";

export interface GetDetailedHealthUseCase {
  execute(): Promise<HealthStatus>;
}

export const GetDetailedHealthUseCase = Symbol('GetDetailedHealthUseCase');

export class GetDetailedHealthUseCaseExecuter implements GetDetailedHealthUseCase {
  async execute(): Promise<HealthStatus> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'health-api',
      checks: [
        {
          name: 'database',
          status: 'ok',
        },
        {
          name: 'cache',
          status: 'ok',
        },
      ],
    };
  }
}