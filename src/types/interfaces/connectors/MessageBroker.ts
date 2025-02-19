import { JsonObject } from '../common/json';

export type MessageMetadata = Record<string, string | number>;

export interface ReceiveMessagesResult {
  handler: string;
  body: JsonObject | { raw: string };
  metadata: MessageMetadata | null;
}

export type MessageDataType = 'String' | 'Number';

export interface MessageBroker {
  sendMessage(body: JsonObject, queueUrl: string, metadata?: MessageMetadata): Promise<void>;
  receiveMessage(
    visibilityTimeoutInSeconds: number,
    queueUrl: string
  ): Promise<ReceiveMessagesResult | null>;
  deleteMessage(receiptHandle: string, queueUrl: string): Promise<void>;
}
