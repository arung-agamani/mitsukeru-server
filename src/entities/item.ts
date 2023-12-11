import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./baseItem";

@Entity()
export default class Item extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  type!: string;

  @Property()
  description!: string;
}
