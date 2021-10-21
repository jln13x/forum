import path from "path";
import { ConnectionOptions } from "typeorm";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
// import { FakePosts1629554113659 } from "./migrations/1629554113659-FakePosts";

export const typeormConfig: ConnectionOptions = {
  type: "postgres",
  database: "reddit-clone-2",
  username: "postgres",
  password: "postgres",
  logging: true,
  // Creates tables automatically, no need for migrations
  synchronize: !__prod__,
  entities: [Post, User],
  // with classes
  // migrations: [FakePosts1629554113659]
  // with path
  migrations: [path.join(__dirname, "./migrations/*")]
};