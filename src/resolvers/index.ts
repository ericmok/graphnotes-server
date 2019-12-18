import { NonBlankString } from './Scalars';
import { GraphQLJSONObject } from 'graphql-type-json';
import { decodeIdOrThrow, Context } from '../utils';
import { Query } from './Query';
import { UserResolver } from './UserResolver';
import { GraphResolver } from './GraphResolver';
import Auth from './Mutation/Auth';
import Graph from './Mutation/Graph';
import VertexResolver from './VertexResolver';

export default {
  Query,
  Mutation: {
    ...Auth,
    ...Graph
  },
  Node: {
    __resolveType(obj: any, context: Context, info: any) {
      const idPayload = decodeIdOrThrow(obj.id);
      return idPayload.typeName;
    }
  },
  JSONObject: GraphQLJSONObject,
  NonBlankString,
  User: UserResolver,
  Graph: GraphResolver,
  Vertex: VertexResolver
}