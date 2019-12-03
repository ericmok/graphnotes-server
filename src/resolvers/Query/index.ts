import { GQLQueryResolvers, GQLGraph } from "../../generated/graphql";
import { User } from "../../entity/User";
import AuthService from "../../services/Auth";
import GraphService from "../../services/Graph";

export const Query: GQLQueryResolvers = {
  async users(root, args, context, info) {
    const users = await context.db.manager.find(User);
    return users.map(user => user.toGQL());
  },
  async me(root, args, context) {
    return context.user.toGQL();
  },
  async graph(root, { id }, context) {
    return await GraphService.getGraph(id, context);
  }
}