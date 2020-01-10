import { GQLMutationResolvers } from '../../generated/graphql';
import GraphService from '../../services/GraphService';
import { AuthenticationError } from 'apollo-server';
import { Context, decodeIdOrThrow } from '../../utils';
import { Arc } from '../../entity/Arc';

const Graph: GQLMutationResolvers = {
  async createGraph(parent, { name }, context) {
    if (context.user) {
      const result = await GraphService.createGraph(context.user, name);
      return result;
    }
    throw new AuthenticationError("Must be signed in to create Graph");
  },
  async createVertex(parent, args, context, info) {
    return GraphService.createVertex(args.graphId, context.user, args.content, args.components);
  },
  async createArc(parent, args, context: Context) {
    const { vertexSrcId, vertexDstId } = args;
    const eVertexSrcId = decodeIdOrThrow(vertexSrcId).id;
    const eVertexDstId = decodeIdOrThrow(vertexDstId).id;

    const arcRepo = context.db.manager.getRepository(Arc);
    const newArc = new Arc();
    newArc.userId = context.user.id;
    newArc.srcVertexId = eVertexSrcId;
    newArc.dstVertexId = eVertexDstId;

    const saveResult = await arcRepo.save(newArc);
    return saveResult.toGQL();
  }
}

export default Graph;