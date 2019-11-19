import { Query } from './Query';
import Auth from './Mutation/Auth';
import { NonBlankString } from './Scalars';
import { decodeId, Context } from '../utils';

export default {
  Query,
  Mutation: {
    ...Auth
  },
  Node: {
    __resolveType(obj: any, context: Context, info: any) {
      const idPayload = decodeId(obj.id);
      return idPayload.typeName;
    }
  },
  NonBlankString
}