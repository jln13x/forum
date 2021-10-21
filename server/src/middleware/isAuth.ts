import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

// Runs before the resolvers
// Can take in the context as type, so we get type hinting

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not authenticated!");
  }

  return next();
};
