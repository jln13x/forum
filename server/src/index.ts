import "reflect-metadata";
import express from "express";
import { COOKIE_NAME, __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import {createConnection} from "typeorm";
import {typeormConfig} from "./typeorm-config";

// Main Function to avoid top-level await 
const main = async () => {
  const con = await createConnection(typeormConfig);
  con.runMigrations();

  // Returns a promise, so we await it 
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({ 
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.get("/", (_, res) => {
    res.redirect("/graphql");
  });

  app.use(
    session({
      // Name of the cookie
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        // The express-session package uses touch to signal to the store that the user has interacted with the session but hasn't changed anything in its data.
        // Touch alters the last access time of a key
        // Disables re-saving and resetting the TTL when using touch
        disableTouch: true,
      }),
      cookie: {
        // 10 years
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        // You cant access the cookie in your javascript frontend
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https __prod__ == true in prod
      },
      saveUninitialized: false,
      // ToDO env
      secret: "broccolisux",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // req, res from express - gets provided by apollo
    context: ({ req, res }): MyContext => ({req, res, redis }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  app.get("/", (_, res) => res.send("hello"));

  await apolloServer.start();

  // ApolloServer adds cors by default, but we use the express middleware
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(3006, () => {
    console.log("Express Server started on localhost:3006");
  });
};

main().catch((e) => console.log(e));

 