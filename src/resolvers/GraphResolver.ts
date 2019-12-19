import { Context, decodeIdOrThrow, encodeId } from '../utils';
import GraphService from '../services/GraphService';
import { AuthenticationError } from 'apollo-server';
import { getManager } from 'typeorm';
import { Graph as GraphModel } from '../entity/Graph';
import { GQLGraphResolvers } from '../generated/graphql';
import { TYPE_GRAPH, VertexParent } from '../Types';
import { User } from '../entity/User';
import { Vertex } from '../entity/Vertex';

export const GraphResolver: GQLGraphResolvers = {
  id: (parent) => {
    return encodeId(parent._id, TYPE_GRAPH);
  },
  name: (parent) => {
    return parent.name;
  },
  user: async (parent, args, context: Context) => {
    const eid = parent._id;

    // A graph always has a user
    const res = await context.db.getRepository(User).findOneOrFail({
      where: {
        id: parent.user._id
      }
    });
    return res.toGQL();
  },
  vertices: async (parent, args, context: Context) => {
    const eid = parent._id;
    const res = await context.db.getRepository(Vertex).find({
      where: {
        graphId: eid
      }
    });

    return res.map(vertex => {
      return vertex.toGQL();
    });
  }
};