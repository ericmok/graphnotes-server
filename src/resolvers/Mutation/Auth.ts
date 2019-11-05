import { MutationResolvers } from '../../generated/graphql';
// import { getManager } from 'typeorm';
// import { User } from '../../entity/User';
import AuthService from '../../services/Auth';

const Auth: MutationResolvers = {
  async signup(root, { username, password }, context) {
    const result = await AuthService.signup(username, password);
    return result.toGQL();
  }
}

export default Auth;