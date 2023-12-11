import { Options } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { Migrator } from "@mikro-orm/migrations";
import { FoundItemEntity } from "./entities/foundItem";
import { LostItemEntity } from "./entities/lostItem";

const options: Options = {
  type: "sqlite",
  dbName: "mitsukeru-data.db",
  debug: true,
  highlighter: new SqlHighlighter(),
  extensions: [Migrator],
  entities: [FoundItemEntity, LostItemEntity],
};

export default options;
