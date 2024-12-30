import * as winston from 'winston';
import * as WinstonTransport from 'winston-transport';
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';

type CloudWatchTransportOptions = {
  logGroupName: string;
  logStreamName: string;
  awsRegion: string;
};

export class CloudWatchTransport extends WinstonTransport {
  private cloudWatchLogsClient: CloudWatchLogsClient;
  private logGroupName: string;
  private logStreamName: string;
  private awsRegion: string;

  constructor(options: CloudWatchTransportOptions) {
    super();

    this.cloudWatchLogsClient = new CloudWatchLogsClient({
      region: options.awsRegion,
    });
    this.logGroupName = options.logGroupName;
    this.logStreamName = options.logStreamName;
    this.awsRegion = options.awsRegion;
  }

  // Ensure Log Group exists
  private async ensureLogGroup(): Promise<void> {
    try {
      const describeGroupsCommand = new DescribeLogGroupsCommand({
        logGroupNamePrefix: this.logGroupName,
      });
      const describeGroupsResponse = await this.cloudWatchLogsClient.send(
        describeGroupsCommand,
      );

      // If the log group doesn't exist, create it
      if (
        !describeGroupsResponse.logGroups ||
        describeGroupsResponse.logGroups.length === 0
      ) {
        const createLogGroupCommand = new CreateLogGroupCommand({
          logGroupName: this.logGroupName,
        });
        await this.cloudWatchLogsClient.send(createLogGroupCommand);
      }
    } catch (error) {
      console.error('Error ensuring log group exists:', error);
    }
  }

  // Ensure Log Stream exists
  private async ensureLogStream(): Promise<void> {
    try {
      const describeStreamsCommand = new DescribeLogStreamsCommand({
        logGroupName: this.logGroupName,
        logStreamNamePrefix: this.logStreamName,
      });
      const describeStreamsResponse = await this.cloudWatchLogsClient.send(
        describeStreamsCommand,
      );

      if (
        !describeStreamsResponse.logStreams ||
        describeStreamsResponse.logStreams.length === 0
      ) {
        const createLogStreamCommand = new CreateLogStreamCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
        });
        await this.cloudWatchLogsClient.send(createLogStreamCommand);
      }
    } catch (error) {
      console.error('Error ensuring log stream:', error);
    }
  }

  // Write logs to CloudWatch
  private async writeToCloudWatch(
    message: string,
    metadata?: any,
    trace?: any,
  ): Promise<void> {
    console.log(metadata);
    const data =
      typeof metadata === 'string'
        ? { message, metadata }
        : metadata?.level === 'error'
          ? { message, ...metadata, trace }
          : { message, ...metadata };

    const params = {
      logEvents: [
        {
          message: JSON.stringify(data),
          timestamp: Date.now(),
        },
      ],
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
    };

    try {
      const putLogEventsCommand = new PutLogEventsCommand(params);
      await this.cloudWatchLogsClient.send(putLogEventsCommand);
    } catch (error) {
      console.error('Error writing log to CloudWatch:', error);
    }
  }

  log(info: winston.Logform.TransformableInfo, callback: () => void): void {
    this.ensureLogGroup()
      .then(() => this.ensureLogStream())
      .then(() => console.log(info))
      .then(() =>
        this.writeToCloudWatch(
          info.message as string,
          info?.metadata as any,
          info?.trace as any,
        ),
      )
      .finally(callback);
  }
}
