import { z } from 'zod';

export default class UserRegisterValidator {
  static schema = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    username: z.string().min(1),
  });

  static validate = this.schema.safeParse;
}
