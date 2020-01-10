import { ApolloServerTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';

const GQL_GET_USERS = gql`query { users { username } }`;

const GQL_SIGNUP_USER = gql`
  mutation SignupUser($username: NonBlankString!, $password: NonBlankString!) {
    signup(username: $username, password: $password) {
         id
         username
       }
  }`;

const GQL_LOGIN_USER = gql`
  mutation LoginUser($username: NonBlankString!, $password: NonBlankString!) {
    login(username: $username, password: $password) { 
      token 
    }
  }`;

export const queryUsers = async (client: ApolloServerTestClient) => {
  return await client.query({
    query: GQL_GET_USERS
  });
};

export const signupUser = async (client: ApolloServerTestClient, username: string, password: string) => {
  // return client.mutate({
  //   mutation: GQL_SIGNUP_USER,
  //   variables: {
  //     username,
  //     password
  //   }
  // });
  return client.mutate({
    mutation: gql`
      mutation {
        signup(username: "${username}", password: "${password}") {
          id
          username
        }
      }`
  });
};

export const loginUser = async (client: ApolloServerTestClient, username: string, password: string) => {
  // return client.mutate({
  //   mutation: GQL_LOGIN_USER,
  //   variables: {
  //     username, 
  //     password
  //   }
  // })
  return client.mutate({
    mutation: gql`
      mutation {
        login(username: "${username}", password: "${password}") { token }
      }
    `
  });
};

const GQL_CREATE_GRAPH = gql`
  mutation CreateGraph($name: String) {
    createGraph(name: $name) { 
      id
      name
    }
  }`;


export const createGraph = async (
  client: ApolloServerTestClient, 
  name: string) => {
  return client.mutate({
    mutation: GQL_CREATE_GRAPH,
    variables: {
      name
    }
  })
};

export const CREATE_ARC_GQL = gql`
mutation CreateArcMutation($vertexSrcId: ID!, $vertexDstId: ID!) {
  createArc(vertexSrcId: $vertexSrcId, vertexDstId: $vertexDstId) {
    id
    user {
      id
      username
    }
    src {
      id
      user {
        id
        username
      }
      content
    }
    dst {
      id
      user {
        id
        username
      }
      content
    }
  }
}
`;

export async function createArc(client: ApolloServerTestClient, vertexSrcId: string, vertexDstId: string) {
  return await client.mutate({
    mutation: CREATE_ARC_GQL,
    variables: {
      vertexSrcId,
      vertexDstId
    }
  });
}

const GQL_QUERY_ARC = gql`
  query QueryArc($id: ID!) {
    arc(id: $id) { 
      id
      user {
        id
        username
      }
      src {
        id
        user {
          id
          username
        }
        content
      }
      dst {
        id
        user {
          id
          username
        }
        content
      }
    }
  }`;

export const queryArc = async (client: ApolloServerTestClient, id: string) => {
  return await client.query({
    query: GQL_QUERY_ARC,
    variables: {
      id
    }
  });
};