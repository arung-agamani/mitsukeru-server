import { Request, Response, Router } from "express";
import multer from "multer";
import { GetImageRequestParams, ImageMetadata } from "../entities/mediaEntity";
import { Storage, ApiError } from "@google-cloud/storage";
import { Container } from "typedi";
import path from "path";
import {
  BadRequest400,
  InternalServerError500,
  NotFound404,
} from "../common-responses";
import { EntityManager } from "@mikro-orm/core";
import { z } from "zod";
import { LostItem, LostItemEntity, LostItemSchema } from "../entities/lostItem";
import {
  FoundItem,
  FoundItemEntity,
  FoundItemSchema,
} from "../entities/foundItem";
import config from "../config";

const upload = multer({
  storage: multer.memoryStorage(),
});
const router = Router();
const storage = new Storage({
  keyFilename: path.resolve(__dirname, "../..", "sa.json"),
});
const bucket = storage.bucket(config.BUCKET_NAME);

router.get("/", async (req: Request, res: Response) => {
  return res.json({
    message: "Items endpoint",
  });
});

router.get("/image", async (req: Request, res: Response) => {
  const rawParams = req.query;
  const validated = GetImageRequestParams.safeParse(rawParams);
  if (!validated.success) {
    return BadRequest400(res);
  }
  const id = validated.data.id;

  try {
    const fileContent = await bucket.file(`${id}.png`).download();
    res.writeHead(200, {
      "content-type": "image/png",
      "content-length": fileContent[0].length,
    });
    return res.end(fileContent[0]);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === 404) {
        return NotFound404(res, { message: "No file found with given id" });
      }
      console.error(error.code, error.message);
      return InternalServerError500(res);
    }
    console.error(error);
    console.error("Unknown error. Exception stack shown above");
    return InternalServerError500(res);
  }
});

router.post(
  "/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const rawBody = req.body;
    const validated = ImageMetadata.safeParse(rawBody);
    if (!validated.success) {
      return res.status(400).json({
        message: "Malformed request body",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        message: "Empty file",
      });
    }
    const metadata = validated.data;
    const image = req.file;
    try {
      await bucket.file(`${metadata.id}.png`).save(image.buffer);
      return res.json({
        message: `Uploaded file ${metadata.id}.png`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Something went wrong...",
      });
    }
  }
);

const GetItemsDataRequestParams = z.object({
  type: z.enum(["lostItems", "foundItems"]),
});
type GetItemsDataRequestParams = z.infer<typeof GetItemsDataRequestParams>;

router.get("/data", async (req: Request, res: Response) => {
  const rawQuery = req.query;
  const validated = GetItemsDataRequestParams.safeParse(rawQuery);
  if (!validated.success) {
    return BadRequest400(res);
  }
  const query = validated.data;
  let em = Container.get("em") as EntityManager;
  em = em.fork();

  try {
    if (query.type === "lostItems") {
      const allItems = await em.find(LostItemEntity, {});
      return res.json(allItems);
    } else {
      const allItems = await em.find(FoundItemEntity, {});
      return res.json(allItems);
    }
  } catch (error) {
    console.error(error);
    return InternalServerError500(res);
  }
});

const PostItemsDataRequestBody = z.object({
  type: z.enum(["lostItems", "foundItems"]),
  data: z.union([LostItem.array(), FoundItem.array()]),
});
type PostItemsDataRequestBody = z.infer<typeof PostItemsDataRequestBody>;
router.post("/data", async (req: Request, res: Response) => {
  const rawBody = req.body;
  const validated = PostItemsDataRequestBody.safeParse(rawBody);
  if (!validated.success) {
    console.log(validated.error);
    return BadRequest400(res);
  }
  let em = Container.get("em") as EntityManager;
  em = em.fork();
  const { type, data } = validated.data;
  try {
    if (type === "lostItems") {
      const thisData = data as LostItemSchema[];
      const upsertMany = await em.upsertMany(LostItemEntity, thisData);
      return res.json({
        message: `${upsertMany.length} data updated for lost items`,
      });
    } else {
      const thisData = data as FoundItemSchema[];
      const upsertMany = await em.upsertMany(FoundItemEntity, thisData);
      return res.json({
        message: `${upsertMany.length} data updated for found items`,
      });
    }
  } catch (error) {
    console.error(error);
    return InternalServerError500(res);
  }
});

export default router;
