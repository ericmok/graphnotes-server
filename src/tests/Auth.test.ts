import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLResponse } from 'graphql-extensions';
import { Connection } from 'typeorm';
import createTestServer, { getTestDatabaseInstance } from './TestServer';
import { UserAlreadyExistsError } from '../services/Auth';
import { SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG } from '../resolvers/Scalars';

let server: ApolloServer;
let client: ApolloServerTestClient;
let testDatabase: Connection;

const GET_USERS = gql`query { users { username } }`;
const queryUsers = async (client: ApolloServerTestClient) => {
  return await client.query({
    query: GET_USERS
  });
};

describe('Auth', () => {
  beforeEach(async () => {
    testDatabase = await getTestDatabaseInstance();
    await testDatabase.synchronize(true);
    server = await createTestServer(testDatabase);
    client = createTestClient(server);
  });
  afterEach(async () => {
    server.stop();
  });

  describe('Signup', () => {

    test('Can signup', async () => {
      let res: GraphQLResponse;
      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      res = await client.mutate({
        mutation: gql`mutation { signup(username:"test3", password: "test3") { username }}`
      })
      expect(res.data.signup.username).toBe("test3");

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(1);
    });

    test(`Fails with duplicate usernames with an error`, async () => {
      /*
      We start with zero users. Try to add users twice. Then check # users.
      */
      let res: GraphQLResponse;
      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      res = await client.mutate({
        mutation: gql`mutation { signup(username:"test3", password: "test3") { username }}`
      })
      expect(res.data.signup.username).toBe("test3");

      res = await client.mutate({
        mutation: gql`mutation { signup(username:"test3", password: "test3") { username }}`
      });
      expect(res.errors[0].message).toContain("username");
      expect(res.errors[0].extensions.code).toBe('BAD_USER_INPUT');

      res = await queryUsers(client);
      expect(res.data.users.length).not.toBe(2);
    });

    test(`Fails with no username / password with an error`, async () => {
      // First Attempt

      let res: GraphQLResponse;
      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      res = await client.mutate({
        mutation: gql`mutation { signup(username:"", password: "") { username }}`
      });

      expect(res.data).toBeUndefined();
      expect(res.errors.length).toBe(2);
      expect(res.errors[0].message).toContain(SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG);

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      // Second Attempt

      res = await client.mutate({
        mutation: gql`mutation { signup(username:"asdf", password: "") { username }}`
      });

      expect(res.data).toBeUndefined();
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain(SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG);

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      // Third Attempt

      res = await client.mutate({
        mutation: gql`mutation { signup(username:"", password: "asdf") { username }}`
      });

      expect(res.data).toBeUndefined();
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain(SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG);

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);
    });
  });

});