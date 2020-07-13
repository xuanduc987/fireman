import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars';

import { typeDef as File, resolvers as fileResolvers } from './file';
import { Resolvers } from '../generated/graphql';

const Query = `
  type Query {
    fileById(id: ID!): FileInfo!
  }
`;

export const typeDefs = [DateTimeTypeDefinition, File, Query];
const queryResolver: Resolvers = {
  Query: {
    fileById: (_, { id }) => ({ id: id ? id : '/' }),
  },
};

export const resolvers = {
  ...fileResolvers,
  ...queryResolver,
  DateTime: DateTimeResolver,
};
