import UserRegisterValidator from 'App/Validators/UserRegisterValidator';
import UserUpdateValidator from 'App/Validators/UserUpdateValidator';
import { User } from 'Database/entities/user';
import { ic } from 'azle';
import { Response, Request } from 'express';

export default class UsersController {
  static async me(request: Request, response: Response) {
    try {
      const user = await User.findOneBy({
        principal_id: ic.caller().toText(),
      });

      if (!user) {
        response.status(404);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      return response.json({
        status: 1,
        data: user,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async register(request: Request, response: Response) {
    const { data, success, error } = UserRegisterValidator.validate(request.body);

    if (!success) {
      response.status(400);
      const { path, message } = error.issues?.[0];

      return response.json({
        status: 0,
        message: `${path?.join('.')}: ${message}`,
      });
    }

    const { email, username, name } = data;

    const userData: Partial<User> = {
      email,
      name,
      username,
      principal_id: ic.caller().toText(),
      status: 1,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    try {
      const isUserExists = await User.findOne({
        where: [{ email }, { principal_id: ic.caller().toText() }, { username }],
      });

      if (isUserExists) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Username/Email/Identity already taken.',
        });
      }

      await User.save(userData);

      return response.json({
        status: 1,
        message: 'Registration success!',
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async update(request: Request, response: Response) {
    const { data, success, error } = UserUpdateValidator.validate(request.body);

    if (!success) {
      response.status(400);
      const { path, message } = error.issues?.[0];
      return response.json({
        status: 0,
        message: `${path?.join('.')}: ${message}`,
      });
    }

    const { name, tiktok, instagram, facebook, twitter, website, bio, profile_photo, banner_photo } = data;

    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found!',
        });
      }

      if (bio) {
        findUser.bio = bio;
      }

      if (name) {
        findUser.name = name;
      }

      if (tiktok) {
        findUser.tiktok = tiktok;
      }

      if (twitter) {
        findUser.twitter = twitter;
      }

      if (instagram) {
        findUser.instagram = instagram;
      }

      if (facebook) {
        findUser.facebook = facebook;
      }

      if (website) {
        findUser.website = website;
      }

      if (profile_photo) {
        findUser.profile_photo = profile_photo;
      }

      if (banner_photo) {
        findUser.banner_photo = banner_photo;
      }

      findUser.updated_at = Date.now();

      await findUser.save();

      return response.json({
        status: 1,
        message: 'User updated successfully!',
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async view_info_of_user_by_public(request: Request, response: Response) {
    try {
      const { username } = request.params;

      const user = await User.findOneBy({
        username,
        status: 1,
      });

      if (!user) {
        response.status(404);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      return response.json({
        status: 1,
        data: user,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }
}
