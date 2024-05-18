import { ConfigurationEntity } from 'Database/entities/configuration';
import { Database } from 'Database/index';
import { Response, Request } from 'express';

const ApisController = {
  async health(request: Request, response: Response) {
    return (response.send().statusCode = 204);
  },
  async config(request: Request, response: Response) {
    try {
      const dataSource = await (request.app.locals.database as Database).getDataSource();
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
  },
};

export default ApisController;
