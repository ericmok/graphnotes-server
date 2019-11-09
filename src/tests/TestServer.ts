import * as fs from 'fs';
import { createConnection, Connection } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { ApolloServer, gql } from 'apollo-server';
import resolvers from '../resolvers/index';

let cachedConnection: Connection = null;

const createTestDatabase = async () => {
  const connection = await createConnection({
    "type": "mongodb",
    "host": "localhost",
    "port": 27017,
    "database": "test",
    "synchronize": true,
    "logging": false,

    "useUnifiedTopology": true,

    "entities": [
      __dirname + "/../entity/**/*.ts"
    ]
  });

  cachedConnection = connection;

  return connection;
};

export const getTestDatabaseInstance = async() => {
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
      request: {req: {
        headers: testHeaders}
      },
      db: testDatabase
    })
  });

  return server;
};

export default createTestServer;

/*
References:
https://github.com/typeorm/typeorm/issues/2882
https://github.com/nestjs/nest/issues/1455
*/
