import * as fs from 'fs';
import { ApolloServer, gql, UserInputError } from 'apollo-server';
import resolvers from './resolvers';
import "reflect-metadata";
import { createConnection } from "typeorm";
import config from '../ormconfig';
import { User } from "./entity/User";
import { RequiresAuthDirective } from './resolvers/Directives';
import { APP_SECRET } from './utils';

createConnection(config).then(async connection => {

  const server = new ApolloServer({
    typeDefs: gql(fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')),
    resolvers,
    context: request => ({
      appSecret: APP_SECRET,
      request,
      db: connection
    }),
    schemaDirectives: {
      requiresAuth: RequiresAuthDirective
    }
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });

}).catch(error => console.log(error));

