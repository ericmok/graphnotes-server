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
      id
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
