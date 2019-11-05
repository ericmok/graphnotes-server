import { ObjectID } from "typeorm";
import { GQLQueryResolvers } from "../generated/graphql";
import { User } from "../entity/User";

export const Query: GQLQueryResolvers = {
  users(root, args, context, info) {
    const users = context.db.mongoManager.find(User);
    console.log(users);
    return users;
  }
}