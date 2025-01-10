import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { PublicRoute } from '@src/auth/set-public.metadata';
import { APP_CONFIG_NAME, AppConfig } from '@src/config/env/app/app.config';
import { DEFAULT_APP_VERSION } from 'src/app.constant';

@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @PublicRoute()
  @Get('ping')
  ping() {
    return 'pong';
  }

  @PublicRoute()
  @Get()
  @HealthCheck()
  check() {
    const port = this.configService.get<AppConfig>(APP_CONFIG_NAME)!.port;

    return this.health.check([
      () =>
        // TODO: update port to use env var, domain
        this.http.pingCheck(
          'local-ping',
          `http://127.0.0.1:${port}/v${DEFAULT_APP_VERSION}/health/ping`,
        ),
    ]);
  }
}
