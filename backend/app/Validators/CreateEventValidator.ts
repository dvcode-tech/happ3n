import { EventRequiredApproval, EventType } from 'Database/entities/event';
import { z } from 'zod';

export default class CreateEventValidator {
  static schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    start_at: z.number(),
    end_at: z.number(),
    location: z.string().min(1),
    required_approval: z.nativeEnum(EventRequiredApproval),
    capacity: z.number(),
    banner: z.string().min(1),
    questions: z.string().optional(),
    type: z.nativeEnum(EventType),
    parameter: z.string().optional(),
    description: z.string().min(1),
  });

  static validate = this.schema.safeParse;
}
