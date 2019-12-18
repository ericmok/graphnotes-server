import { Context, decodeIdOrThrow, encodeId } from '../utils';
import GraphService from '../services/GraphService';
import { AuthenticationError } from 'apollo-server';
import { getManager } from 'typeorm';
import { User } from '../entity/User';
import { GQLUserResolvers } from '../generated/graphql';
import { TYPE_USER } from '../Types';

export const UserResolver: GQLUserResolvers = {
  id: (parent) => {
    return encodeId(parent._id, TYPE_USER);
  },
  graphs: async ({ id }, args: any, context: Context) => {
    const r = getManager().getRepository(User);

    const userId = decodeIdOrThrow(id).id;
    const user = await r.findOne({ id: userId });

    return GraphService.getGraphsForUser(user);
  }
};

export default UserResolver;