import { EventRequiredApproval, EventType } from 'Database/entities/event';
import { z } from 'zod';

export default class CreateEventValidator {
  static schema = z.object({
    name: z.string(),
    start_at: z.number(),
    end_at: z.number(),
    location: z.string(),
    required_approval: z.nativeEnum(EventRequiredApproval),
    capacity: z.number(),
    banner: z.string(),
    type: z.nativeEnum(EventType),
    parameter: z.string().optional(),
    description: z.string(),
  });

  static validate = this.schema.safeParse;
}
