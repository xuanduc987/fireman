import { ApolloServer } from 'apollo-server';

import { createContext } from './context';
import { resolvers, typeDefs } from './schema/index';

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: createContext,
});

// The `listen` method launches a web server.
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
