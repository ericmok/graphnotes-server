import { Context, decodeId } from '../utils';
import GraphService from '../services/Graph';
import { AuthenticationError } from 'apollo-server';
import { getManager } from 'typeorm';
import { User as UserModel } from '../entity/User';

export const User = {
  graphs: async ({ id }, args: any, context: Context) => {
    const r = getManager().getRepository(UserModel);
    
    const userId = Number.parseInt(decodeId(id).id);
    const user = await r.findOne({ id: userId });

    return GraphService.getGraphsForUser(user);
  }
};