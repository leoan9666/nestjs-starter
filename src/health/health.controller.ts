import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { DEFAULT_APP_VERSION } from 'src/app.constant';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get('ping')
  ping() {
    return 'pong';
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        // TODO: update port to use env var
        this.http.pingCheck(
          'local-ping',
          `http://127.0.0.1:8000/v${DEFAULT_APP_VERSION}/health/ping`,
        ),
    ]);
  }
}
