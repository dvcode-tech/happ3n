import { UserEntity } from 'Database/entities/user';
import { Database } from 'Database/index';
import { ic } from 'azle';
import { Response, Request } from 'express';

export default class UsersController {
  static async me(request: Request, response: Response) {
    try {
      const dataSource = await (request.app.locals.database as Database).getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const user = await userRepository.findOneBy({
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
    const { email, name, username } = request.body;

    if (!email || !name || !username) {
      response.status(400);
      return response.json({
        status: 0,
        message: 'Email and name, username are required.',
      });
    }

    const userData: Partial<UserEntity> = {
      email,
      name,
      username,
      principal_id: ic.caller().toText(),
      status: 1,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    try {
      const dataSource = await (request.app.locals.database as Database).getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const checkIfEmailExists = await userRepository.findOneBy({ email });
      const checkIfPrincipalIdExist = await userRepository.findOneBy({ principal_id: ic.caller().toText() });

      if (checkIfEmailExists) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User already exist.',
        });
      }

      if (checkIfPrincipalIdExist) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User already exist.',
        });
      }

      await userRepository.save(userData);

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
}
