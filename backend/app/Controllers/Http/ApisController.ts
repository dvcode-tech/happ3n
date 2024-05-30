import { Configuration } from 'Database/entities/configuration';
import { Response, Request } from 'express';
import { createReadStream, writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import mime from 'mime';

export default class ApisController {
  static async health(request: Request, response: Response) {
    return (response.send().statusCode = 204);
  }

  static async config(request: Request, response: Response) {
    try {
      const configurations = await Configuration.find();

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

  static async testupload(request: Request, response: Response) {
    try {
      const file = request.body.file;
      const filePath = `${Date.now()}-${file.filename}`;

      const fileBuffer = Buffer.from(file.contents, 'base64');

      writeFileSync(filePath, fileBuffer);

      return response.json({
        status: 1,
        data: filePath,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async readupload(request: Request, response: Response) {
    try {
      const { filename } = request.params;
      const contents = await readFile(filename as any);

      const mimeType = mime.getType(filename) || 'text/plain';

      response.setHeader('Content-Type', mimeType);
      response.send(contents);
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async readupload_v2(request: Request, response: Response) {
    try {
      const { filename } = request.params;
      const fileStream = createReadStream(filename);

      for await (const data of fileStream) {
        response.write(data);
      }

      response.end();
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }
}
