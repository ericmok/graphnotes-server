import { Query } from './Query';
import { User } from './User';
import Auth from './Mutation/Auth';
import { NonBlankString } from './Scalars';
import { decodeId, Context } from '../utils';
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
      const idPayload = decodeId(obj.id);
      return idPayload.typeName;
    }
  },
  NonBlankString,
  User,
  Graph: GraphResolver
}