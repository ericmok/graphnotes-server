import { GQLMutationResolvers } from '../../generated/graphql';
import AuthService from '../../services/Auth';

const Auth: GQLMutationResolvers = {
  async signup(root, { username, password }, context) {
    const result = await AuthService.signup(username, password);
    return result.toGQL();
  }
}

export default Auth;