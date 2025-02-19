import { z } from 'zod';
import { NotificationTypes } from '../../enums/common/NotificationTypes';

export const NotificationMessageDtoSchema = z.object({
  type: z.nativeEnum(NotificationTypes)
});

export type NotificationMessageDto = z.infer<typeof NotificationMessageDtoSchema>;
