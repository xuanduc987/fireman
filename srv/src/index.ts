import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import express from 'express';

import { createContext } from './context';
import { resolvers, typeDefs } from './schema/index';

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: createContext,
});

const app = express();
app.use(express.static(path.join(__dirname, '../public'), { dotfiles: 'allow' }));
server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
  ),
);
