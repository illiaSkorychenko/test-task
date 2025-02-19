import { NotificationTypes } from '../../enums/common/NotificationTypes';

export interface MetricService {
  incActionCounter(type: NotificationTypes): Promise<void>;
  getMetrics(): Promise<{ metrics: string; contentType: string }>;
}
