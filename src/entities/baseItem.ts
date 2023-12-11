import { string, z } from "zod";
import { PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

export abstract class BaseEntity {
  @PrimaryKey()
  id: string = v4();

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}

export const BaseItem = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  type: z.string(),
  description: z.string(),
  // deletedAt: z.date().nullable(),
});

export type BaseItemSchema = z.infer<typeof BaseItem>;

export const emptyBaseItem: BaseItemSchema = {
  id: "",
  name: "",
  type: "",
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  // deletedAt: null,
};
