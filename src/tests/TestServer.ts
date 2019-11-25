import * as fs from 'fs';
import { createConnection, Connection } from 'typeorm';
import { ApolloServer, gql } from 'apollo-server';
import resolvers from '../resolvers/index';
import { RequiresAuthDirective } from '../resolvers/Directives';
import { APP_SECRET } from '../utils';
import config from '../../ormconfig';

let cachedConnection: Connection = null;

const createTestDatabase = async () => {
  const connection = await createConnection(config);
  cachedConnection = connection;
  return connection;
};

export const getTestDatabaseInstance = async () => {
  try {
    return await createTestDatabase();
  }
  catch (err) {
    return cachedConnection;
  }
}


const createTestServer = async (testDatabase: any, testHeaders: any = {}) => {
  let server = new ApolloServer({
    typeDefs: gql(fs.readFileSync(__dirname.concat('/../schema.graphql'), 'utf8')),
    resolvers,
    context: request => ({
      appSecret: APP_SECRET,
      request: {
        req: {
          headers: testHeaders
        }
      },
      db: testDatabase
    }),
    schemaDirectives: {
      requiresAuth: RequiresAuthDirective
    }
  });

  return server;
};

export default createTestServer;

/*
References:
https://github.com/typeorm/typeorm/issues/2882
https://github.com/nestjs/nest/issues/1455
*/
