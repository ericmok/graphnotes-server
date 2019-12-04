import { GQLMutationResolvers } from '../../generated/graphql';
import AuthService from '../../services/AuthService';

const Auth: GQLMutationResolvers = {
  async signup(root, { username, password }, context) {
    const result = await AuthService.signup(username, password);
    return result.toGQL();
  },
  async login(root, { username, password }, context) {
    const result = await AuthService.login(username, password);
    return result;
  }
}

export default Auth;