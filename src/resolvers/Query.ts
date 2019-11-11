import { ObjectID } from "typeorm";
import { GQLQueryResolvers } from "../generated/graphql";
import { User } from "../entity/User";
import AuthService from "../services/Auth";

export const Query: GQLQueryResolvers = {
  users(root, args, context, info) {
    const users = context.db.mongoManager.find(User);
    // console.log(users);
    return users;
  },
  async isLoggedIn(root, args, context) {
    if (context.request.req.headers['authorization'] === undefined) {
      return false;
    }
    
    const authHeader = context.request.req.headers['authorization'];
    return AuthService.isLoggedIn(authHeader);
  }
}