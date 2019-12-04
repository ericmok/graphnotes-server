import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver, GraphQLDirective, DirectiveLocation, GraphQLField } from 'graphql';
import { Context, getTokenFromContext } from '../utils';
import AuthService, { UnknownAuthError } from '../services/AuthService';
import { getManager } from 'typeorm';
import { User } from '../entity/User';

export class RequiresAuthDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName = 'requiresAuth') {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION]
    });
  }

  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (source, args, context: Context, info) {
      const token = getTokenFromContext(context);

      const user = await AuthService.validateToken(token);
      const userEntity = await getManager().findOne(User, { username: user.username });
      
      if (userEntity) {
        return await resolve.call(this, source, args, {...context, user: userEntity}, info);
      }

      throw new UnknownAuthError('');
    };
  }
}