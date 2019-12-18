import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import { GraphQLResponse } from 'graphql-extensions';
import { Connection } from 'typeorm';
import { GQLToken } from '../generated/graphql';
import createTestServer, { getTestDatabaseInstance, clearDatabase } from './TestServer';
import { queryUsers, signupUser, loginUser, createGraph } from './TestQueries';
import { TYPE_GRAPH, TYPE_VERTEX } from '../Types';
import { JsonWebTokenError } from 'jsonwebtoken';
import { encodeId, decodeIdOrThrow } from '../utils';
import { User } from '../entity/User';
import { Graph } from '../entity/Graph';
import { GRAPH_UNIQUE_NAME_REQUIRED_MSG } from '../services/GraphService';
import gql from 'graphql-tag';
import * as util from 'util';

let server: ApolloServer;
let client: ApolloServerTestClient;
let testDatabase: Connection;

let res: GraphQLResponse;
let token: string;
let graphId: number;

describe('Vertex', () => {

  beforeEach(async () => {
    testDatabase = await getTestDatabaseInstance();
    await clearDatabase();

    server = await createTestServer(testDatabase);
    client = createTestClient(server);

    res = await signupUser(client, "test", "test");
    res = await loginUser(client, "test", "test");

    token = res.data.login.token;

    server = await createTestServer(testDatabase, { 'authorization': token });
    client = createTestClient(server);

    res = await createGraph(client, "my graph");
    graphId = res.data.createGraph.id;

    expect(res.data.createGraph.id).toBeDefined();
  });

  afterAll(async () => {
    server.stop();
  });

  test('Can create vertex', async () => {
    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation($graphId: ID!, $content: String!, $components: [JSONObject]) {
          createVertex(graphId: $graphId, content: $content, components: $components) {
            id
            content
            graph {
              id
            }
            components
          }
        }
      `,
      variables: {
        graphId: graphId,
        content: "test",
        components: [{ "collapsed": true }]
      }
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createVertex.id).toBeDefined();
    expect(res.data.createVertex.graph.id).toBeDefined();
    expect(res.data.createVertex.components).toBeDefined();
    expect(res.data.createVertex.components[0].collapsed).toBe(true);
  });

  test('Can create vertex with no components', async () => {
    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation($graphId: ID!, $content: String!, $components: [JSONObject]) {
          createVertex(graphId: $graphId, content: $content, components: $components) {
            id
            content
            graph {
              id
            }
            components
          }
        }
      `,
      variables: {
        graphId: graphId,
        content: "test"
      }
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createVertex.id).toBeDefined();
    expect(res.data.createVertex.graph.id).toBeDefined();
    expect(res.data.createVertex.components).toBeDefined();
    expect(res.data.createVertex.components.length).toBe(0);
  });

  test('Can create vertex with null components', async () => {
    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation($graphId: ID!, $content: String!, $components: [JSONObject]) {
          createVertex(graphId: $graphId, content: $content, components: $components) {
            id
            content
            graph {
              id
            }
            components
          }
        }
      `,
      variables: {
        graphId: graphId,
        content: "test",
        components: [null]
      }
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createVertex.id).toBeDefined();
    expect(res.data.createVertex.graph.id).toBeDefined();
    expect(res.data.createVertex.components).toBeDefined();
    expect(res.data.createVertex.components.length).toBe(0);
  });

  test('Can create vertex with null components', async () => {
    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation($graphId: ID!, $content: String!, $components: [JSONObject]) {
          createVertex(graphId: $graphId, content: $content, components: $components) {
            id
            content
            graph {
              id
            }
            components
          }
        }
      `,
      variables: {
        graphId: graphId,
        content: "test",
        components: null
      }
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createVertex.id).toBeDefined();
    expect(res.data.createVertex.graph.id).toBeDefined();
    expect(res.data.createVertex.components).toBeDefined();
    expect(res.data.createVertex.components.length).toBe(0);
  });

  test('Cannot create vertex with bad graphId', async () => {
    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation($graphId: ID!, $content: String!, $components: [JSONObject]) {
          createVertex(graphId: $graphId, content: $content, components: $components) {
            id
            content
            graph {
              id
            }
            components
          }
        }
      `,
      variables: {
        graphId: "arh9h0arjeio",
        content: "test",
        components: null
      }
    });

    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.data.createVertex).toBeNull();
  });

  test('Can query vertex', async () => {

    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation($graphId: ID!, $content: String!, $components: [JSONObject]) {
          createVertex(graphId: $graphId, content: $content, components: $components) {
            id
            content
            graph {
              id
            }
            components
          }
        }
      `,
      variables: {
        graphId: graphId,
        content: "vertex",
        components: [{ "collapsed": true }]
      }
    });

    res = await client.query({
      query: gql`
        query GetVertex($vertexId: ID!) {
          vertex(id: $vertexId) {
            id
            user {
              id
              username
            }
            graph {
              id
              name
            }
            content
            components
          }
        }
      `,
      variables: {
        vertexId: res.data.createVertex.id
      }
    })

    expect(res.errors).toBeUndefined();
    expect(res.data.vertex.id).toBeDefined();
    expect(res.data.vertex.user.username).toBe("test");
    expect(res.data.vertex.graph.id).toBe(graphId);
    expect(res.data.vertex.content).toBe("vertex");
    expect(res.data.vertex.components[0].collapsed).toBe(true);
  });

  test('Can query vertex with bad id', async () => {

    res = await client.query({
      query: gql`
        query GetVertex($vertexId: ID!) {
          vertex(id: $vertexId) {
            id
            user {
              id
              username
            }
            graph {
              id
              name
            }
            content
            components
          }
        }
      `,
      variables: {
        vertexId: "waefja0w9ejf"
      }
    })

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].extensions.code).toBe('BAD_USER_INPUT');
    expect(res.data.vertex).toBeNull();

    res = await client.query({
      query: gql`
        query GetVertex($vertexId: ID!) {
          vertex(id: $vertexId) {
            id
            user {
              id
              username
            }
            graph {
              id
              name
            }
            content
            components
          }
        }
      `,
      variables: {
        vertexId: encodeId(1234567, TYPE_VERTEX)
      }
    })

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].extensions.code).toBe('NOT_FOUND_ERROR');
    expect(res.data.vertex).toBeNull();
  });
});