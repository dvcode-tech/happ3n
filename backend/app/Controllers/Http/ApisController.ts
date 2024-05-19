import { ConfigurationEntity } from 'Database/entities/configuration';
import { Response, Request } from 'express';

export default class ApisController {
  static async health(request: Request, response: Response) {
    return (response.send().statusCode = 204);
  }

  static async config(request: Request, response: Response) {
    try {
      const dataSource = await database.getDataSource();
      const configurationRepository = dataSource.getRepository(ConfigurationEntity);
      const configurations = await configurationRepository.find();

      return response.json({
        status: 1,
        data: configurations,
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
