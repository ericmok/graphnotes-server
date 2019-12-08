import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import { GraphQLResponse } from 'graphql-extensions';
import { Connection } from 'typeorm';
import { GQLToken } from '../generated/graphql';
import createTestServer, { getTestDatabaseInstance, clearDatabase } from './TestServer';
import { queryUsers, signupUser, loginUser, createGraph } from './TestQueries';
import { TYPE_GRAPH } from '../Types';
import { JsonWebTokenError } from 'jsonwebtoken';
import { encodeId, decodeIdOrThrow } from '../utils';
import { User } from '../entity/User';
import { Graph } from '../entity/Graph';
import { GRAPH_UNIQUE_NAME_REQUIRED_MSG } from '../services/GraphService';
import gql from 'graphql-tag';

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
    expect(decodeIdOrThrow(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name).toBe("my graph");

    // TODO: Change Create Graph output...
    // expect(res.data.createGraph.user).not.toBeUndefined();
    // expect(res.data.createGraph.user.username).toBe("test");

    const newGraph = await testDatabase.getRepository(Graph).findOne({ relations: ['user'], where: { id: decodeIdOrThrow(res.data.createGraph.id).id } });
    expect(newGraph.name).toBe("my graph");
    expect(newGraph.user.username).toBe("test");
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
    expect(decodeIdOrThrow(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
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
    expect(decodeIdOrThrow(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name.length).toBeGreaterThan(0);


    client = createTestClient(server);
    res = await createGraph(client, "");

    expect(res.data.createGraph).not.toBeUndefined();
    expect(res.data.createGraph.id).not.toBeUndefined();
    expect(decodeIdOrThrow(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
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
    expect(decodeIdOrThrow(res.data.createGraph.id).typeName).toBe(TYPE_GRAPH);
    expect(res.data.createGraph.name.length).toBeGreaterThan(0);

    res = await createGraph(client, randomGraphName);

    expect(res.data).toBeNull(); // Not sure why this is not undefined
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0].message).toContain(GRAPH_UNIQUE_NAME_REQUIRED_MSG);
    expect(res.errors[0].extensions.code).toContain("BAD_USER_INPUT");

  });

  test('Can get graphs for user with nested query', async () => {
    server = await createTestServer(testDatabase, {
      'authorization': token
    });

    client = createTestClient(server);

    res = await createGraph(client, "graph 1");
    res = await createGraph(client, "graph 2");

    res = await client.query({
      query: gql`
        query MyGraphs {
          me {
            graphs {
              id
              name
              user {
                id
                username
              }
            }
          }
        }
    `});

    expect(res.data).not.toBeUndefined();
    expect(res.data).not.toBeNull();
    expect(res.errors).toBeUndefined();
    expect(res.data.me.graphs.length).toBe(2);
    expect(res.data.me.graphs[0].name).toBe("graph 1");
    expect(res.data.me.graphs[0].user.id).not.toBeUndefined();
    expect(res.data.me.graphs[0].user.username).toBe("test");
    expect(res.data.me.graphs[1].name).toBe("graph 2");
    expect(res.data.me.graphs[1].user.id).not.toBeUndefined();
    expect(res.data.me.graphs[1].user.username).toBe("test");
  });

  test('Can handle getting graphs which user doesn\'t have', async () => {
    server = await createTestServer(testDatabase, {
      'authorization': token
    });

    client = createTestClient(server);

    res = await client.query({
      query: gql`
        query MyGraphs {
          me {
            graphs {
              id
              name
              user {
                id
                username
              }
            }
          }
        }
    `});

    expect(res.data).not.toBeUndefined();
    expect(res.data).not.toBeNull();
    expect(res.errors).toBeUndefined();
    expect(res.data.me.graphs.length).toBe(0);
  });

  test('Cannot get graphs for user without auth', async () => {
    server = await createTestServer(testDatabase, {
      'authorization': token
    });

    client = createTestClient(server);

    res = await createGraph(client, "graph 1");
    res = await createGraph(client, "graph 2");

    server = await createTestServer(testDatabase, {});

    client = createTestClient(server);

    res = await client.query({
      query: gql`
        query MyGraphs {
          me {
            graphs {
              id
              name
              user {
                id
                username
              }
            }
          }
        }
    `});

    expect(res.data.me).toBeNull();
    expect(res.errors.length).toBeGreaterThan(0);
  });

  test('Can get graph by ID', async () => {
    server = await createTestServer(testDatabase, { 'authorization': token });
    client = createTestClient(server);

    res = await createGraph(client, "graph 1");
    const graph = await testDatabase.manager.getRepository(Graph).findOne({
      relations: ['user'], where: {
        name: "graph 1"
      }
    });

    const eid = encodeId(graph.id, TYPE_GRAPH);

    res = await client.query({
      query: gql`
        query GetGraphById($id: ID!) {
          graph(id: $id) {
            id
            name
            user {
              id
              username
            }
          }
        }
      `,
      variables: {
        id: eid
      }
    });

    expect(res.data.graph.id).toBe(eid);
    expect(res.data.graph.name).toBe("graph 1");
    expect(res.data.graph.user.id).not.toBeUndefined();
    expect(res.data.graph.user.username).toBe("test");
    expect(res.errors).toBeUndefined();
  });


  test('Can handle getting graph with invalid id', async () => {
    server = await createTestServer(testDatabase, { 'authorization': token });
    client = createTestClient(server);

    res = await createGraph(client, "graph 1");
    const graph = await testDatabase.manager.getRepository(Graph).findOne({
      relations: ['user'], where: {
        name: "graph 1"
      }
    });

    let eid = encodeId((graph.id + 100), TYPE_GRAPH);

    res = await client.query({
      query: gql`
        query GetGraphById($id: ID!) {
          graph(id: $id) {
            id
            name
            user {
              id
              username
            }
          }
        }
      `,
      variables: {
        id: eid
      }
    });

    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0].extensions.code).toContain('NOT_FOUND_ERROR');

    eid = encodeId(NaN, TYPE_GRAPH);

    res = await client.query({
      query: gql`
        query GetGraphById($id: ID!) {
          graph(id: $id) {
            id
            name
            user {
              id
              username
            }
          }
        }
      `,
      variables: {
        id: eid
      }
    });

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].extensions.code).toContain('BAD_USER_INPUT');
    eid = encodeId(NaN, TYPE_GRAPH);

    eid = Buffer.from(`malicious:${graph.id}:string:${graph.id}`).toString('base64');

    res = await client.query({
      query: gql`
        query GetGraphById($id: ID!) {
          graph(id: $id) {
            id
            name
            user {
              id
              username
            }
          }
        }
      `,
      variables: {
        id: eid
      }
    });

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].extensions.code).toContain('BAD_USER_INPUT');
    eid = encodeId(NaN, TYPE_GRAPH);

    res = await client.query({
      query: gql`
        query {
          graph(id: NaN) {
            id
            name
            user {
              id
              username
            }
          }
        }
      `
    });

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].extensions.code).toContain('GRAPHQL_VALIDATION_FAILED');
  });
});