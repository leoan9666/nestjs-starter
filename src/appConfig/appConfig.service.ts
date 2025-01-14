import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWS_CONFIG_NAME, AwsConfig } from '@src/config/env/aws/aws.config';
import { parseJsonSafely } from '@src/util/parse-json';

import {
  AppConfigDataClient,
  GetLatestConfigurationCommand,
  StartConfigurationSessionCommand,
} from '@aws-sdk/client-appconfigdata';

@Injectable()
export class AppConfigService {
  private client: AppConfigDataClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new AppConfigDataClient({
      region: this.configService.get<AwsConfig>(AWS_CONFIG_NAME)!.region,
    });
  }

  async getConfiguration(
    applicationID: string,
    environmentID: string,
    configurationProfileID: string,
  ) {
    const sessionInput = {
      ApplicationIdentifier: applicationID,
      EnvironmentIdentifier: environmentID,
      ConfigurationProfileIdentifier: configurationProfileID,
      // RequiredMinimumPollIntervalInSeconds: Number("int"),
    };
    const sessionCommand = new StartConfigurationSessionCommand(sessionInput);
    const sessionResponse = await this.client.send(sessionCommand);

    const getConfigurationinput = {
      ConfigurationToken: sessionResponse.InitialConfigurationToken,
    };
    const getConfigurationCommand = new GetLatestConfigurationCommand(
      getConfigurationinput,
    );
    const getConfigurationResponse = await this.client.send(
      getConfigurationCommand,
    );

    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(getConfigurationResponse.Configuration);

    return parseJsonSafely(str);
  }
}
