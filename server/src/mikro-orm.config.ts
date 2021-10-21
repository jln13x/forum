import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";

export default {
    // https://mikro-orm.io/docs/migrations/#configuration
    migrations: {
        // Will create an absolute path to avoid possible problems if we run it in different directories
        path: `${__dirname}/migrations`,
        pattern: /^[\w-]+\d+\.(js|ts)$/,
    },
    entities: [Post, User],
    dbName: 'reddit-clone',
    type: 'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]; 