import { ic } from "azle";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { In } from "typeorm";

import { Database } from "./database";
import { CategoryEntity } from "./database/entities/category";
import { ConfigurationEntity } from "./database/entities/configuration";
import { PostEntity } from "./database/entities/post";
import { UserEntity } from "./database/entities/user";

export type CreateServerOptions = {
  database: Database;
};

export function CreateServer({ database }: CreateServerOptions) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.message);
    res.status(500).send("Something broke!");
  });

  function AuthGuard(req: Request, res: Response, next: NextFunction) {
    if (ic.caller().isAnonymous()) {
      res.status(401);
      res.send("You are not authorized to access this resource.");
    } else {
      next();
    }
  }

  app.get("/health", (req, res) => {
    res.send().statusCode = 204;
  });

  app.post("/initialize", AuthGuard, async (req: Request, res) => {
    try {
      const dataSource = await database.getDataSource();
      const configurationRepository = dataSource.getRepository(ConfigurationEntity);
      const categoryRepository = dataSource.getRepository(CategoryEntity);

      await categoryRepository.save([
        {
          name: "General",
        },
        {
          name: "Web3",
        },
        {
          name: "ICP",
        },
      ]);

      await configurationRepository.save([
        {
          key: "site_name",
          value: "ICP HUB PH",
        },
        {
          key: "site_description",
          value:
            "Propelling the adoption of ICP and Web3 in the Philippines. We educate, incubate and accelerate.",
        },
        {
          key: "admin_principal_id",
          value: ic.caller().toText(),
        },
      ]);

      res.json({
        status: 1,
        message: "System initialized!",
      });
    } catch (error: any) {
      res.status(400);
      res.json({
        status: 0,
        message: error.message,
      });
    }
  });

  app.get("/config", async (req: Request, res) => {
    try {
      const dataSource = await database.getDataSource();
      const configurationRepository = dataSource.getRepository(ConfigurationEntity);

      const configurations = await configurationRepository.find();

      res.json({
        status: 1,
        data: configurations,
      });
    } catch (error: any) {
      res.status(400);
      res.json({
        status: 0,
        message: error.message,
      });
    }
  });

  app.get("/categories", async (req: Request, res) => {
    try {
      const dataSource = await database.getDataSource();
      const categoryRepository = dataSource.getRepository(CategoryEntity);

      const categories = await categoryRepository.find();

      res.json({
        status: 1,
        data: categories,
      });
    } catch (error: any) {
      res.status(400);
      res.json({
        status: 0,
        message: error.message,
      });
    }
  });

  app.get("/user", AuthGuard, async (req: Request, res) => {
    try {
      const dataSource = await database.getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const user = await userRepository.findOneBy({
        principal_id: ic.caller().toText(),
      });

      if (!user) {
        res.status(404);
        res.json({
          status: 0,
          message: "User not found.",
        });
        return;
      }

      res.json({
        status: 1,
        data: user,
      });
    } catch (error: any) {
      res.status(400);
      res.json({
        status: 0,
        message: error.message,
      });
    }
  });

  app.post("/user/register", async (req: Request, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
      res.status(400);
      res.json({
        status: 0,
        message: "Email and name are required.",
      });
      return;
    }

    const userData = {
      email,
      name,
      principal_id: ic.caller().toText(),
      role: "user",
      status: 1,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    try {
      const dataSource = await database.getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const checkIfEmailExists = await userRepository.findOneBy({ email });
      const checkIfPrincipalIdExist = await userRepository.findOneBy({ principal_id: ic.caller().toText() });

      if (checkIfEmailExists) {
        res.status(400);
        res.json({
          status: 0,
          message: "User already exist.",
        });
        return;
      }

      if (checkIfPrincipalIdExist) {
        res.status(400);
        res.json({
          status: 0,
          message: "User already exist.",
        });
        return;
      }

      await userRepository.save(userData);

      res.json({
        status: 1,
        message: "Registration success!",
      });
    } catch (error: any) {
      res.status(400);
      res.json({
        status: 0,
        message: error.message,
      });
    }
  });

  app.post("/user/post", AuthGuard, async (req: Request, res) => {
    const { message } = req.body;

    if (!message) {
      res.status(400);
      res.json({
        status: 0,
        message: "Message is required.",
      });
      return;
    }

    try {
      const dataSource = await database.getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const postRepository = dataSource.getRepository(PostEntity);
      const userInfo = await userRepository.findOneBy({
        principal_id: ic.caller().toText(),
      });

      if (!userInfo) {
        res.status(404);
        res.json({
          status: 0,
          message: "User not found.",
        });
        return;
      }

      if (!userInfo.status) {
        res.status(400);
        res.json({
          status: 0,
          message: "User is not active.",
        });
        return;
      }

      await postRepository.save({
        userId: userInfo.id,
        message,
        categoryId: 1,
        status: 1,
        created_at: Date.now(),
        updated_at: Date.now(),
      });

      res.json({
        status: 1,
        message: "Post created!",
      });
    } catch (error: any) {
      res.status(400);
      res.json({
        status: 0,
        message: error.message,
      });
      return;
    }
  });

  app.get("/user/posts", AuthGuard, async (req: Request, res) => {
    try {
      const dataSource = await database.getDataSource();
      const postRepository = dataSource.getRepository(PostEntity);
      const configurationRepository = dataSource.getRepository(ConfigurationEntity);

      const checkIfAdmin = await configurationRepository.findOneBy({
        key: "admin_principal_id",
        value: ic.caller().toText(),
      });

      let posts: PostEntity[] = [];

      if (!checkIfAdmin) {
        posts = await postRepository.findBy({ status: 1 });
      } else {
        posts = await postRepository.find();
      }

      res.json({
        status: 1,
        data: posts,
      });
    } catch (error: any) {
      res.status(400);
      res.json({
        status: 0,
        message: error.message,
      });
      return;
    }
  });

  app.post("/admin/post/moderate", AuthGuard, async (req: Request, res) => {
    const { id, status } = req.body;

    if (!id) {
      res.status(400);
      res.json({
        status: 0,
        message: "Post id is required.",
      });
      return;
    }

    const dataSource = await database.getDataSource();
    const postRepository = dataSource.getRepository(PostEntity);
    const configurationRepository = dataSource.getRepository(ConfigurationEntity);

    const checkIfAdmin = await configurationRepository.findOneBy({
      key: "admin_principal_id",
      value: ic.caller().toText(),
    });

    if (!checkIfAdmin) {
      res.status(400);
      res.json({
        status: 0,
        message: "Only admins can moderate posts.",
      });
      return;
    }

    const post = await postRepository.findOneBy({ id });

    if (!post) {
      res.status(404);
      res.json({
        status: 0,
        message: "Post not found.",
      });
      return;
    }

    await postRepository.update({ id }, { status });

    res.json({
      status: 1,
      message: "Post moderated!",
    });
  });

  app.post("/admin/user/moderate", AuthGuard, async (req: Request, res) => {
    const { id, status } = req.body;

    if (!id) {
      res.status(400);
      res.json({
        status: 0,
        message: "User id is required.",
      });
      return;
    }

    const dataSource = await database.getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);
    const configurationRepository = dataSource.getRepository(ConfigurationEntity);

    const checkIfAdmin = await configurationRepository.findOneBy({
      key: "admin_principal_id",
      value: ic.caller().toText(),
    });

    if (!checkIfAdmin) {
      res.status(400);
      res.json({
        status: 0,
        message: "Only admins can moderate users.",
      });
      return;
    }

    const user = await userRepository.findOneBy({ id });

    if (!user) {
      res.status(404);
      res.json({
        status: 0,
        message: "User not found.",
      });
      return;
    }

    await userRepository.update({ id }, { status });

    res.json({
      status: 1,
      message: "User moderated!",
    });
  });

  app.post("/admin/configuration/manage", AuthGuard, async (req: Request, res) => {
    const { key, value } = req.body;

    if (!key) {
      res.status(400);
      res.json({
        status: 0,
        message: "Key is required.",
      });
      return;
    }

    if (!value) {
      res.status(400);
      res.json({
        status: 0,
        message: "Value is required.",
      });
      return;
    }

    const dataSource = await database.getDataSource();
    const configurationRepository = dataSource.getRepository(ConfigurationEntity);

    const checkIfAdmin = await configurationRepository.findOneBy({
      key: "admin_principal_id",
      value: ic.caller().toText(),
    });

    if (!checkIfAdmin) {
      res.status(400);
      res.json({
        status: 0,
        message: "Only admins can manage configurations.",
      });
      return;
    }

    const configuration = await configurationRepository.findOneBy({ key });

    if (!configuration) {
      res.status(404);
      res.json({
        status: 0,
        message: "Configuration not found.",
      });
      return;
    }

    await configurationRepository.update({ key }, { value });

    res.json({
      status: 1,
      message: "Configuration updated!",
    });
  });

  return app.listen();
}
