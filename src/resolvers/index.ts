import { Query } from './Query';
import { User } from './User';
import Auth from './Mutation/Auth';
import { NonBlankString } from './Scalars';
import { decodeIdOrThrow, Context } from '../utils';
import Graph from './Mutation/Graph';
import { GraphResolver } from './Graph';

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
  NonBlankString,
  User,
  Graph: GraphResolver
}