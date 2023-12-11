import { z } from "zod";

export const ImageMetadata = z.object({
  id: z.string(),
  //   createdAt: z.date(),
});

export type ImageMetadataSchema = z.infer<typeof ImageMetadata>;

export const emptyImageMetadata: ImageMetadataSchema = {
  id: "",
  //   createdAt: new Date(),
};

export const GetImageRequestParams = z.object({
  id: z.string(),
});
export type GetImageRequestParams = z.infer<typeof GetImageRequestParams>;
