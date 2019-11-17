import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import { GraphQLResponse } from 'graphql-extensions';
import { Connection } from 'typeorm';
import { GQLToken } from '../generated/graphql';
import createTestServer, { getTestDatabaseInstance } from './TestServer';
import { UserAlreadyExistsError } from '../services/Auth';
import { SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG } from '../resolvers/Scalars';
import { queryUsers, signupUser, loginUser } from './TestQueries';
import { JsonWebTokenError } from 'jsonwebtoken';

let server: ApolloServer;
let client: ApolloServerTestClient;
let testDatabase: Connection;


describe('Auth', () => {

  describe('Signup', () => {
    beforeEach(async () => {
      testDatabase = await getTestDatabaseInstance();
      await testDatabase.synchronize(true);
      server = await createTestServer(testDatabase);
      client = createTestClient(server);
    });
    afterEach(async () => {
      server.stop();
    });

    test('Can signup', async () => {
      let res: GraphQLResponse;
      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      res = await signupUser(client, "test3", "test3");
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

      res = await signupUser(client, "test3", "test3");
      expect(res.data.signup.username).toBe("test3");

      res = await signupUser(client, "test3", "test3");
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

      res = await signupUser(client, "", "");

      expect(res.data).toBeUndefined();
      expect(res.errors.length).toBe(2);
      expect(res.errors[0].message).toContain(SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG);

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      // Second Attempt

      res = await signupUser(client, "asdf", "");

      expect(res.data).toBeUndefined();
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain(SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG);

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      // Third Attempt

      res = await signupUser(client, "", "asdf");

      expect(res.data).toBeUndefined();
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain(SCALAR_NON_BLANK_STRING_VALUE_ERROR_MSG);

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);
    });
  });


  describe('Login', () => {

    beforeAll(async () => {

      testDatabase = await getTestDatabaseInstance();
      await testDatabase.synchronize(true);
      server = await createTestServer(testDatabase);
      client = createTestClient(server);

      let res: GraphQLResponse;
      res = await queryUsers(client);
      expect(res.data.users.length).toBe(0);

      // Create User
      res = await signupUser(client, "test", "test");

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(1);
    });

    afterAll(async () => {
      server.stop();
    });

    test('Can Login and get Token', async () => {
      let res: GraphQLResponse;

      res = await loginUser(client, "test", "test");

      expect(res.errors).toBeUndefined();
      expect(res.data.login).toBeDefined();
      expect(res.data.login.token).not.toBeNull();
      expect(typeof res.data.login.token).toBe("string");
      expect(res.data.login.token.length).toBeGreaterThan(1);
    });

    test('Errors out on wrong password', async () => {
      let res: GraphQLResponse;

      res = await loginUser(client, "test", "asdf");

      expect(res.data.login).toBeNull();
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].extensions.code).toBe("UNAUTHENTICATED");
    });

    test('Errors out on empty password', async () => {
      let res: GraphQLResponse;

      // Empty Password
      res = await loginUser(client, "test", "");

      expect(res.data).not.toBeDefined();
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain("empty");
    });

    test('Errors out on empty username', async () => {
      let res: GraphQLResponse;

      // Empty Username
      res = await loginUser(client, "", "asdf");

      expect(res.data).not.toBeDefined();
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain("empty");
    });

  });

  describe('me', () => {
    beforeAll(async () => {
      testDatabase = await getTestDatabaseInstance();
      await testDatabase.synchronize(true);
      server = await createTestServer(testDatabase, {
      });
      client = createTestClient(server);

      let res: GraphQLResponse;

      // Signup
      res = await signupUser(client, "test", "test");

      res = await queryUsers(client);
      expect(res.data.users.length).toBe(1);
    });

    test('Can test if is logged in', async () => {
      let res: GraphQLResponse;

      // Login
      res = await loginUser(client, "test", "test");

      server = await createTestServer(testDatabase, {
        'authorization': res.data.login.token
      });
      client = createTestClient(server);

      // Test if logged in
      res = await client.query({
        query: gql`query { me { username } }`
      });

      expect(res.data.me.username).toBe("test");
      expect(res.errors).toBeUndefined();
    });

    test('Throws unauthenticated error with non string tokens', async () => {
      let res: GraphQLResponse;

      server = await createTestServer(testDatabase, {
        'authorization': 1234
      });
      client = createTestClient(server);

      // Test if logged in
      res = await client.query({
        query: gql`query { me { username } }`
      });

      expect(res.data.me).toBe(null);
      expect(res.errors.length).toBeGreaterThan(0);

      const error = res.errors[0];
      expect(error.extensions.code).toBe("UNAUTHENTICATED");
      expect(error.message).toContain('jwt must be a string');
    });

    test('Throws unauthenticated error when no token', async () => {
      let res: GraphQLResponse;

      server = await createTestServer(testDatabase, {
      });
      client = createTestClient(server);

      // Test if logged in
      res = await client.query({
        query: gql`query { me { username } }`
      });

      expect(res.data.me).toBe(null);
      expect(res.errors.length).toBeGreaterThan(0);

      const error = res.errors[0];
      expect(error.extensions.code).toBe("UNAUTHENTICATED");
      expect(error.message).toContain('jwt must be provided');
    });

    test('Throws unauthenticated error when wrong token', async () => {
      let res: GraphQLResponse;
      res = await loginUser(client, "test", "test");

      server = await createTestServer(testDatabase, {
        'authorization': 'wrong' + res.data.login.token + 'wrong'
      });
      client = createTestClient(server);

      // Test if logged in
      res = await client.query({
        query: gql`query { me { username } }`
      });

      expect(res.data.me).toBe(null);
      expect(res.errors.length).toBeGreaterThan(0);

      const error = res.errors[0];
      expect(error.extensions.code).toBe("UNAUTHENTICATED");
      expect(error.message).toContain("invalid token");
    });

    test.todo('Returns false when token expires');
  });

});

/*
References:
https://github.com/apollographql/apollo-server/issues/2277
*/