import { EventRequiredApproval, EventStatus, EventType } from 'Database/entities/event';
import { z } from 'zod';

export default class UpdateEventValidator {
  static schema = z.object({
    name: z.string().optional(),
    status: z.nativeEnum(EventStatus).optional(),
    start_at: z.number().optional(),
    end_at: z.number().optional(),
    location: z.string().optional(),
    required_approval: z.nativeEnum(EventRequiredApproval).optional(),
    capacity: z.number().optional(),
    banner: z.string().optional(),
    type: z.nativeEnum(EventType).optional(),
    questions: z.string().optional(),
    parameter: z.string().optional(),
    description: z.string().optional(),
  });

  static validate = this.schema.safeParse;
}
