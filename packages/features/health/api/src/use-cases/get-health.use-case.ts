import { HealthStatus } from "@piar/health-configuration";

export interface GetHealthUseCase {
  execute(): Promise<HealthStatus>;
}

export const GetHealthUseCase = Symbol('GetHealthUseCase');

export class GetHealthUseCaseExecuter implements GetHealthUseCase {
  async execute(): Promise<HealthStatus> {
    return { 
        status: 'ok',
        service: 'health-api',
        timestamp: new Date().toISOString(),
     };
  }
}