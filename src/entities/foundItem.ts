import { z } from "zod";
import { BaseItem, emptyBaseItem } from "./baseItem";
import { Entity, Property } from "@mikro-orm/core";
import Item from "./item";

export type FoundItemStatus = "reported" | "claimed";

@Entity()
export class FoundItemEntity extends Item {
  @Property()
  location: string = "";

  @Property()
  status: FoundItemStatus = "reported";

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
}

export const FoundItem = BaseItem.extend({
  location: z.string(),
  status: z.enum(["reported", "claimed"]),
});

export type FoundItemSchema = z.infer<typeof FoundItem>;

export const emptyLostItem: FoundItemSchema = {
  ...emptyBaseItem,
  description: "",
  location: "",
  status: "reported",
};
