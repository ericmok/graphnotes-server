import { Context, decodeIdOrThrow } from '../utils';
import GraphService from '../services/Graph';
import { AuthenticationError } from 'apollo-server';
import { getManager } from 'typeorm';
import { User } from '../entity/User';

export const UserResolver = {
  graphs: async ({ id }, args: any, context: Context) => {
    const r = getManager().getRepository(User);
    
    const userId = decodeIdOrThrow(id).id;
    const user = await r.findOne({ id: userId });

    return GraphService.getGraphsForUser(user);
  }
};

export default UserResolver;