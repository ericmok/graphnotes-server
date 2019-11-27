import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import { GraphQLResponse } from 'graphql-extensions';
import { Connection } from 'typeorm';
import { GQLToken } from '../generated/graphql';
import createTestServer, { getTestDatabaseInstance, clearDatabase } from './TestServer';
import { queryUsers, signupUser, loginUser, createGraph } from './TestQueries';
import { TYPE_GRAPH } from '../resolvers/Types';
import { JsonWebTokenError } from 'jsonwebtoken';
import { encodeId, decodeId } from '../utils';
import { User } from '../entity/User';
import { GRAPH_UNIQUE_NAME_REQUIRED_MSG } from '../services/Graph';

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

    token = res.data.login.token;
  });
  afterAll(async () => {
    server.stop();
  });

  test('Can create graph', async () => {

    server = await createTestServer(testDatabase, {
      'authorization': token
    });

    client = createTestClient(server);
    res = await createGraph(client, "my graph");

    expect(res.data.createGraph).not.toBeUndefined();
    expect(res.data.createGraph.id).not.toBeUndefined();
    expect(decodeId(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name).toBe("my graph");
  });

  test('Throws error when no login', async () => {

    server = await createTestServer(testDatabase, {
    });
    client = createTestClient(server);
    res = await createGraph(client, "my graph");

    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0].extensions.code).toContain('UNAUTHENTICATED');
  });


  test('Can assign new graphs with empty names a random name', async () => {
    server = await createTestServer(testDatabase, {
      'authorization': token
    });

    client = createTestClient(server);
    res = await createGraph(client, "");

    expect(res.data.createGraph).not.toBeUndefined();
    expect(res.data.createGraph.id).not.toBeUndefined();
    expect(decodeId(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name.length).toBeGreaterThan(0);
    expect(res.data.createGraph.name).not.toBe("");
  });

  test('Can handle creating graphs with empty names multiple times', async () => {
    server = await createTestServer(testDatabase, {
      'authorization': token
    });

    client = createTestClient(server);
    res = await createGraph(client, "");

    expect(res.data.createGraph).not.toBeUndefined();
    expect(res.data.createGraph.id).not.toBeUndefined();
    expect(decodeId(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name.length).toBeGreaterThan(0);


    client = createTestClient(server);
    res = await createGraph(client, "");

    expect(res.data.createGraph).not.toBeUndefined();
    expect(res.data.createGraph.id).not.toBeUndefined();
    expect(decodeId(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name.length).toBeGreaterThan(0);

    expect(res.errors).toBeUndefined();
  });

  test('Throws error when creating graphs with duplicate names', async () => {
    server = await createTestServer(testDatabase, {
      'authorization': token
    });

    client = createTestClient(server);

    const randomGraphName = Math.random().toString();

    res = await createGraph(client, randomGraphName);

    expect(res.data.createGraph).not.toBeUndefined();
    expect(res.data.createGraph.id).not.toBeUndefined();
    expect(decodeId(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name.length).toBeGreaterThan(0);

    res = await createGraph(client, randomGraphName);

    expect(res.data).toBeNull(); // Not sure why this is not undefined
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0].message).toContain(GRAPH_UNIQUE_NAME_REQUIRED_MSG);
    expect(res.errors[0].extensions.code).toContain("BAD_USER_INPUT");

  });
});