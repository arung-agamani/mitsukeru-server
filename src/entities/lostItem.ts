import { z } from "zod";
import { BaseItem, emptyBaseItem } from "./baseItem";
import { Entity, Property } from "@mikro-orm/core";
import Item from "./item";

export type LostItemStatus = "reported" | "claimed";

@Entity()
export class LostItemEntity extends Item {
  constructor(name: string, type: string, desc: string, loc: string) {
    super();
    this.name = name;
    this.type = type;
    this.description = desc;
    this.location = loc;
    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
    this.status = "reported";
  }

  @Property()
  location: string = "";

  @Property()
  status: LostItemStatus = "reported";
}

export const LostItem = BaseItem.extend({
  location: z.string(),
  status: z.enum(["reported", "claimed"]),
});

export type LostItemSchema = z.infer<typeof LostItem>;

export const emptyLostItem: LostItemSchema = {
  ...emptyBaseItem,
  description: "",
  location: "",
  status: "reported",
};
