import { Query } from './Query';
import Auth from './Mutation/Auth';
import { NonBlankString } from './Scalars';

export default {
  Query,
  Mutation: {
    ...Auth
  },
  NonBlankString
}