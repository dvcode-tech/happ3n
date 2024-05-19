import { z } from 'zod';

export default class UserRegisterValidator {
  static schema = z.object({
    name: z.string(),
    email: z.string(),
    username: z.string(),
  });

  static validate = this.schema.safeParse;
}
