import * as fs from 'fs';
import { ApolloServer, gql } from 'apollo-server';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs: gql(fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')),
  resolvers,
  context: request => ({
    ...request
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});