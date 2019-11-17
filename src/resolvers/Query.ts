import { ObjectID } from "typeorm";
import { GQLQueryResolvers } from "../generated/graphql";
import { User } from "../entity/User";
import AuthService from "../services/Auth";
import { getTokenFromContext } from '../utils';

export const Query: GQLQueryResolvers = {
  users(root, args, context, info) {
    const users = context.db.mongoManager.find(User);
    return users;
  },
  async me(root, args, context) {
    return context.user;
  }
}