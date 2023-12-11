import "reflect-metadata";

import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import itemsRouter from "./routes/items";
import { EntityManager, MikroORM } from "@mikro-orm/core";
import options from "./mikro-orm.config";
import { Container } from "typedi";

const app: Express = express();
const port = process.env.PORT || 3000;

const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
};

async function main() {
  DI.orm = await MikroORM.init(options);
  DI.em = DI.orm.em;
  await DI.orm.schema.updateSchema();
  Container.set("orm", DI.orm);
  Container.set("em", DI.em);
  app.use(bodyParser.json());
  app.use("/items", itemsRouter);

  app.get("/", (req: Request, res: Response) => {
    res.json({
      name: "mitsukeru-server",
      version: "0.0.1",
      message: "絶対に見つけよう！",
    });
  });

  app.get("/sync", async (req: Request, res: Response) => {
    const body = req.body;
    console.log(body);
    res.json({
      message: "Synced",
      body,
    });
  });

  app.listen(port, () => {
    console.log("Server is listening on port " + port);
  });
}

main();
