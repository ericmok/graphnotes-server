import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import { GraphQLResponse } from 'graphql-extensions';
import createTestServer, { getTestDatabaseInstance } from './TestServer';

const GET_USERS = gql`query { users { username } }`;

xdescribe('Database', () => {
  it('should create and drop tables/collections', async () => {
    let testDatabase = await getTestDatabaseInstance();
    let server = await createTestServer(testDatabase);
    let client = await createTestClient(server);

    expect(client).not.toBe(null);
    expect(client.query).not.toBe(null);

    let res: GraphQLResponse;
    res = await client.query({
      query: GET_USERS
    });
    expect(res.data.users.length).toBe(0);

    res = await client.mutate({
      mutation: gql`mutation { signup(username:"test3", password: "test3") { username }}`
    })
    expect(res.data.signup.username).toBe("test3");

    res = await client.query({
      query: GET_USERS
    });
    expect(res.data.users.length).toBe(1);

    testDatabase = await getTestDatabaseInstance();
    server = await createTestServer(testDatabase);
    client = await createTestClient(server);

    res = await client.query({
      query: GET_USERS
    });
    expect(res.data.users.length).toBe(0);
  });
});
