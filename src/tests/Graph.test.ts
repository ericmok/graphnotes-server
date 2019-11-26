import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import { GraphQLResponse } from 'graphql-extensions';
import { Connection } from 'typeorm';
import { GQLToken } from '../generated/graphql';
import createTestServer, { getTestDatabaseInstance, clearDatabase } from './TestServer';
import { queryUsers, signupUser, loginUser, createGraph } from './TestQueries';
import { JsonWebTokenError } from 'jsonwebtoken';
import { encodeId, decodeId } from '../utils';
import { User } from '../entity/User';

let server: ApolloServer;
let client: ApolloServerTestClient;
let testDatabase: Connection;

let res: GraphQLResponse;
let token: string;


describe('Graph', () => {
  beforeEach(async () => {
    testDatabase = await getTestDatabaseInstance();
    await clearDatabase();
    server = await createTestServer(testDatabase);
    client = createTestClient(server);

    res = await signupUser(client, "test", "test");
    res = await loginUser(client, "test", "test");

    // console.log(res);
    token = res.data.login.token;

    server = await createTestServer(testDatabase, {
      'authorization': token
    });
  });
  afterEach(async () => {
    server.stop();
  });

  test.todo('Can create graph');
});