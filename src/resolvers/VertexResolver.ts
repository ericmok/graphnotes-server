import { GQLVertexResolvers } from '../generated/graphql';
import { Context, encodeId } from '../utils';
import { GraphQLResolveInfo } from 'graphql';
import { Graph } from '../entity/Graph';
import { TYPE_GRAPH, GraphParent, TYPE_USER } from '../Types';
import { User } from '../entity/User';

export const VertexResolver: GQLVertexResolvers = {
  id(parent) {
    return encodeId(parent._id, TYPE_USER);
  },
  async user(parent, args, context: Context, info: GraphQLResolveInfo) {
    const user = await context.db.getRepository(User).findOneOrFail({
      where: {
        id: parent.user._id
      }
    });
    return user.toGQL();
  },
  async graph(parent, args: any, context: Context, info: GraphQLResolveInfo) {
    const relGraph = await context.db.getRepository(Graph).findOneOrFail({
      relations: ['user'],
      where: {
        id: parent.graph._id
      }
    });

    const ret: GraphParent = {
      _id: relGraph.id,
      id: encodeId(relGraph.id, TYPE_GRAPH),
      name: relGraph.name,
      user: { // This will get resolved by GraphResolver
        _id: relGraph.user.id
      }
    };

    return ret;
  }
};

export default VertexResolver;