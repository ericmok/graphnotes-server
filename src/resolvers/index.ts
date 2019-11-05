import { Query } from './Query';
import Auth from './Mutation/Auth';

export default {
  Query,
  Mutation: {
    ...Auth
  }
}