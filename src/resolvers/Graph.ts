import { Context, decodeId } from '../utils';
import GraphService from '../services/Graph';
import { AuthenticationError } from 'apollo-server';
import { getManager } from 'typeorm';
import { Graph as GraphModel } from '../entity/Graph';
import { User as UserModel } from '../entity/User';

export const GraphResolver = {
  user: async ({ id }, args, context: Context) => {
    const eid =  Number.parseInt(decodeId(id).id);
    const res = await getManager().getRepository(GraphModel).findOneOrFail({ relations: ['user'], where: { id: eid } });
    // A graph always has a user
    return res.user.toGQL();
  }
};