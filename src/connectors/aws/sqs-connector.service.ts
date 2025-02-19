import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQS,
  SQSClientConfig
} from '@aws-sdk/client-sqs';
import { MessageAttributeValue } from '@aws-sdk/client-sqs/dist-types/models/models_0';
import { Injectable } from '@nestjs/common';
import {
  MessageMetadata,
  MessageBroker,
  MessageDataType
} from '../../types/interfaces/connectors/MessageBroker';
import { EnvTypes } from '../../types/enums/common/EnvTypes';
import { ConfigConnectorService } from '../config/config-connector.service';
import { MessageBrokerPayloadTypes } from '../../types/enums/connectors/MessageBrokerPayloadTypes';
import { JsonObject } from '../../types/interfaces/common/json';
import { ApplicationException } from '../../types/exceptions/ApplicationException';

const PAYLOAD_TYPE_KEY = 'type';

@Injectable()
export class SqsConnectorService implements MessageBroker {
  private client: SQS;

  constructor(configConnectorService: ConfigConnectorService) {
    const envConfig = configConnectorService.getEnvConfig();

    const config: SQSClientConfig = {
      region: envConfig.AWS_REGION
    };

    if (envConfig.NODE_ENV === EnvTypes.Local) {
      config.endpoint = envConfig.SQS_CUSTOM_ENDPOINT || 'http://localhost:4566';
      config.credentials = {
        accessKeyId: '',
        secretAccessKey: ''
      };
    }

    this.client = new SQS(config);
  }

  private makeSqsAttributes(metadata?: MessageMetadata) {
    const sqsAttributes: Record<string, MessageAttributeValue> = {
      [PAYLOAD_TYPE_KEY]: {
        DataType: 'String',
        StringValue: MessageBrokerPayloadTypes.Json
      }
    };

    if (!metadata) {
      return sqsAttributes;
    }

    for (const [name, value] of Object.entries(metadata)) {
      const dataType: MessageDataType = typeof value === 'number' ? 'Number' : 'String';

      sqsAttributes[name] = {
        DataType: dataType,
        StringValue: value.toString()
      };
    }

    return sqsAttributes;
  }

  private parseSqsAttributes(
    attributes?: Record<string, MessageAttributeValue>
  ): MessageMetadata | null {
    if (!attributes) {
      return null;
    }

    const metadata: MessageMetadata = {};

    for (const [name, value] of Object.entries(attributes)) {
      if (!value.StringValue) {
        continue;
      }

      metadata[name] = value.StringValue;
    }

    if (!Object.keys(metadata).length) {
      return null;
    }

    return metadata;
  }

  public async sendMessage(body: JsonObject, queueUrl: string, metadata?: MessageMetadata) {
    const messageAttributes = this.makeSqsAttributes(metadata);
    const messageBody = JSON.stringify(body);

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      MessageAttributes: messageAttributes
    });

    await this.client.send(command);
  }

  public async receiveMessage(visibilityTimeoutInSeconds: number, queueUrl: string) {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      VisibilityTimeout: visibilityTimeoutInSeconds,
      MessageAttributeNames: ['All']
    });
    const { Messages: messages } = await this.client.send(command);

    if (!messages) {
      return null;
    }

    const [message] = messages;
    const { MessageAttributes: attributes, ReceiptHandle: handler, Body: rawBody } = message;

    if (!rawBody) {
      throw new ApplicationException('Message body is empty');
    }

    const metadata = this.parseSqsAttributes(attributes);
    let body: JsonObject = {};

    if (!metadata || !metadata[PAYLOAD_TYPE_KEY]) {
      body.raw = rawBody;
    }

    if (metadata && metadata[PAYLOAD_TYPE_KEY] === MessageBrokerPayloadTypes.Json) {
      try {
        body = JSON.parse(rawBody);
      } catch (err) {
        throw new ApplicationException('Message body is not a valid JSON', err);
      }
    }

    return {
      handler: handler!,
      metadata,
      body
    };
  }

  public async deleteMessage(receiptHandle: string, queueUrl: string) {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle
    });

    await this.client.send(command);
  }
}
