import {
  createTestClient,
  ApolloServerTestClient
} from "apollo-server-testing";
import { ApolloServer } from "apollo-server";
import { GraphQLResponse } from "graphql-extensions";
import { Connection } from "typeorm";
import createTestServer, {
  getTestDatabaseInstance,
  clearDatabase
} from "./TestServer";
import {
  signupUser,
  loginUser,
  createGraph,
  createArc,
  queryArc
} from "./TestQueries";
import gql from "graphql-tag";

let server: ApolloServer;
let client: ApolloServerTestClient;
let testDatabase: Connection;

let res: GraphQLResponse;
let token: string;
let graphId: number;
let vertexSrcId: string;
let vertexDstId: string;

describe("Arc", () => {
  beforeAll(async () => {
    testDatabase = await getTestDatabaseInstance();
    await clearDatabase();

    server = await createTestServer(testDatabase);
    client = createTestClient(server);

    res = await signupUser(client, "test", "test");
    res = await loginUser(client, "test", "test");

    token = res.data.login.token;

    server = await createTestServer(testDatabase, { authorization: token });
    client = createTestClient(server);

    res = await createGraph(client, "my graph");
    graphId = res.data.createGraph.id;

    expect(res.data.createGraph.id).toBeDefined();

    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation(
          $graphId: ID!
          $content: String!
          $components: [JSONObject]
        ) {
          createVertex(
            graphId: $graphId
            content: $content
            components: $components
          ) {
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
        content: "vertex1",
        components: [{ collapsed: true }]
      }
    });

    vertexSrcId = res.data.createVertex.id;

    res = await client.mutate({
      mutation: gql`
        mutation CreateVertexMutation(
          $graphId: ID!
          $content: String!
          $components: [JSONObject]
        ) {
          createVertex(
            graphId: $graphId
            content: $content
            components: $components
          ) {
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
        content: "vertex2",
        components: [{ collapsed: true }]
      }
    });

    vertexDstId = res.data.createVertex.id;
  });

  afterAll(async () => {
    server.stop();
    testDatabase.close();
  });

  describe("After createArc is called", () => {
    beforeAll(async () => {
      server = await createTestServer(testDatabase, { authorization: token });
      client = createTestClient(server);
      res = await createArc(client, vertexSrcId, vertexDstId);
    });

    test("Valid arc is returned", async () => {
      expect(res.errors).toBeUndefined();
      expect(res.data.createArc.user.username).toBe("test");
      expect(res.data.createArc.src.user.username).toBe("test");
      expect(res.data.createArc.src.content).toBe("vertex1");
      expect(res.data.createArc.dst.user.username).toBe("test");
      expect(res.data.createArc.dst.content).toBe("vertex2");
    });

    test("Can query arc by id", async () => {
      const arcId = res.data.createArc.id;

      let query = await queryArc(client, arcId);

      expect(query.errors).toBeUndefined();
      expect(query.data.arc.user.username).toBe("test");
      expect(query.data.arc.src.user.username).toBe("test");
      expect(query.data.arc.dst.user.username).toBe("test");
    });
  });

  test("createArc can handle bad src", async () => {
    res = await createArc(client, vertexSrcId, "badId");
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toMatchInlineSnapshot(`"Invalid id"`);
    expect(res.data.createArc).toBeNull();
  });

  test("createArc can handle bad dst", async () => {
    await createArc(client, "badId", vertexDstId);
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toMatchInlineSnapshot(`"Invalid id"`);
    expect(res.data.createArc).toBeNull();
  });

  test("createArc can handle no vertex src and/or dst", async () => {
    await createArc(client, null, null);
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toMatchInlineSnapshot(`"Invalid id"`);

    await createArc(client, "", "");
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toMatchInlineSnapshot(`"Invalid id"`);
    expect(res.data.createArc).toBeNull();
  });

  test("createArc can handle bad user", async () => {
    server = await createTestServer(testDatabase, {});
    client = createTestClient(server);

    res = await createArc(client, vertexSrcId, vertexDstId);

    expect(res.errors).toBeDefined();
    expect(res.errors[0].extensions.code).toBe('UNAUTHENTICATED');

    console.log(res.errors);
    expect(res.data.createArc).toBeNull();
  });
});
