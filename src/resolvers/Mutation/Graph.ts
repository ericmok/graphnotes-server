import { GQLMutationResolvers } from '../../generated/graphql';
import GraphService from '../../services/GraphService';
import { AuthenticationError } from 'apollo-server';

const Graph: GQLMutationResolvers = {
  async createGraph(parent, { name }, context) {
    if (context.user) {
      const result = await GraphService.createGraph(context.user, name);
      return result;
    }
    throw new AuthenticationError("Must be signed in to create Graph");
  }
}

export default Graph;