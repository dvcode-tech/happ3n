import { z } from 'zod';

export default class UserUpdateValidator {
  static schema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    tiktok: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
    profile_photo: z.string().optional(),
    banner_photo: z.string().optional(),
  });

  static validate = this.schema.safeParse;
}
